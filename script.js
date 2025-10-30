// Side Bar Functionality
const sidebar = document.querySelector('.sidebar');
const sidebarToggler = document.querySelector('.sidebar-toggler');
// Toggle sidebar's collapsed state
sidebarToggler.addEventListener("click", () => {
	sidebar.classList.toggle("collapsed");
});
