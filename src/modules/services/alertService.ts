/**
 * Displays an alert message on the screen
 * @param {string} message - The message to display
 */
export function showAlert(message:string): void {
    const alertBanner = document.createElement('div');
    alertBanner.className = 'alert-banner';
    alertBanner.textContent = message;

    document.body.appendChild(alertBanner);

    setTimeout(() => {
        alertBanner.remove();
    }, 5000);
}