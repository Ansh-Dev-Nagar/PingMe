// This utility helps manage the sidebar hover state
// by adding/removing a class on the body element

export const initSidebarHover = () => {
  const sidebar = document.querySelector('.side-menu');
  if (!sidebar) return;
  
  // Use a debounce mechanism to prevent rapid class toggling
  let timeout;
  
  sidebar.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
    document.body.classList.add('sidebar-hovered');
  });
  
  sidebar.addEventListener('mouseleave', () => {
    // Small delay before removing the class to prevent flicker
    timeout = setTimeout(() => {
      document.body.classList.remove('sidebar-hovered');
    }, 100);
  });
  
  // Initialize on page load
  if (sidebar.matches(':hover')) {
    document.body.classList.add('sidebar-hovered');
  } else {
    document.body.classList.remove('sidebar-hovered');
  }
}; 