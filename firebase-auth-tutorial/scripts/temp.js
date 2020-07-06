const loginLinks = document.querySelectorAll('.logged-in');
const logoutLinks = document.querySelectorAll('.logged-out');

const setupUI = (user) => {
  if (user) {
    loginLinks.forEach(item => {
      item.style.display='block';
    });
    logoutLinks.forEach(item => {
      item.style.display='none';
    });
  } else {
    loginLinks.forEach(item => {
      item.style.display='none';
    });
    logoutLinks.forEach(item => {
      item.style.display='block';
    });
  }
}

