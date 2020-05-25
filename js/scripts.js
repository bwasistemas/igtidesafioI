/*Estado da Aplicação*/
let tabPeoples = null;
let allPeoples = [];
let statisticsResult = null;
let resultPeople = null;

let countPeoples = 0;
let countPeoplesMan = 0;
let countPeoplesWoman = 0;
let sumAgesPeoples = 0;
let avgAgesPeoples = 0;
let inputSearch = null;
let btnSearch = null;

$('#divCarregando').show();

window.addEventListener('load', () => {
  tabPeoples = document.querySelector('#tabPeoples');
  resultPeople = document.querySelector('#resultPeople');
  statisticsResult = document.querySelector('#statisticsResult');
  inputSearch = document.querySelector('#inputSearch');
  btnSearch = document.querySelector('#btnSearch');

  document.getElementById('btnSearch').disabled = true;

  $('#divCarregando').fadeOut('slow');

  fetchPeoples();
  preventFormSubmit();
  activateImput();
});

function activateImput() {
  function handleTyping(event) {
    var hasText = !!event.target.value && event.target.value.trim() !== ``;

    document.getElementById('btnSearch').disabled = false;

    if (event.key === 'Enter') {
      if (inputSearch.value != '') render();
    }

    if (inputSearch.value == '') {
      document.getElementById('btnSearch').disabled = true;
    }
  }

  inputSearch.addEventListener('keyup', handleTyping);

  inputSearch.focus();
  btnSearch.addEventListener('click', clicou);
}

function render() {
  renderPeopleList();
}

async function fetchPeoples() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=300&nat=BR&noinfo'
  );
  const json = await res.json();

  allPeoples = json.results;

  allPeoples = allPeoples.map((people) => {
    const { name, first, last, picture, gender, dob } = people;

    return {
      name: name.first + ' ' + name.last,
      first: name.first,
      last: name.last,
      picture: picture.medium,
      gender,
      dob: dob.age,
    };
  });
}

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  var form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

function renderPeopleList() {
  let peoplesHTML = '<div>';

  let nameSearch = inputSearch.value.toLowerCase();
  allPeoples = allPeoples.filter(
    (people) => people.name.toLowerCase().indexOf(nameSearch) > -1
  );

  /*Ordenando Elementos*/
  allPeoples.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  /*Percorrendo Vetor*/
  allPeoples.forEach((people) => {
    const { name, picture, gender, dob } = people;

    const peopleHTML = `
  <div class='people'>
  <div>
  <img src="${picture}" alt="${name}">
  ${name}, ${gender}, ${dob} Anos

  </div> 
  </div>
  `;
    peoplesHTML += peopleHTML;
  });

  peoplesHTML += '</div>';
  tabPeoples.innerHTML = peoplesHTML;

  countPeoples = allPeoples.length;

  console.log(allPeoples);
  resultPeople.textContent = countPeoples + ' Usuário(s) encontrado(s)';

  renderSumary();

  statisticsResult.innerHTML = `<ul> Estatísticas: 
  <li>Sexo Masculino: ${countPeoplesMan} </li>
  <li>Sexo Feminino: ${countPeoplesWoman} </li>
  <li>Soma das Idades: ${sumAgesPeoples} </li>
  <li>Media das Idades: ${avgAgesPeoples}</li></ul>`;

  fetchPeoples();
}

function renderSumary() {
  countPeoplesMan = allPeoples.filter((people) => people.gender == 'male')
    .length;

  countPeoplesWoman = allPeoples.filter((people) => people.gender == 'female')
    .length;

  sumAgesPeoples = allPeoples.reduce((accumulator, current) => {
    return accumulator + current.dob;
  }, 0);

  avgAgesPeoples = allPeoples.reduce((accumulator, current) => {
    return accumulator + current.dob;
  }, 0);

  avgAgesPeoples = (sumAgesPeoples / countPeoples).toFixed(2);
}

function clicou() {
  render();
}
