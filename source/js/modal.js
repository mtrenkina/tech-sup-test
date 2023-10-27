const button = document.querySelector('.main-nav__button');
const modal = document.querySelector('.modal');
const modalFirstLink = modal.querySelector('.contacts-list__map-link');

const changeModalVisability = () => {
  if (modal.classList.contains('modal-show')) {
    modal.classList.remove('modal-show');
  } else {
    modal.classList.add('modal-show');
    modalFirstLink.focus();
  }
};

modal.addEventListener('click', (e) => {
  changeModalVisability();
});

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    changeModalVisability();
  }
});

button.addEventListener('click', (e) => {
  changeModalVisability();
});

button.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    changeModalVisability();
  }
});
