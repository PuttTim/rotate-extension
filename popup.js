document.getElementById('rotate0').addEventListener('click', () => rotateElement(0));
document.getElementById('rotate90').addEventListener('click', () => rotateElement(90));
document.getElementById('rotate180').addEventListener('click', () => rotateElement(180));
document.getElementById('rotate270').addEventListener('click', () => rotateElement(270));

function rotateElement(degrees) {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {action: "activate_selector", degrees: degrees});
    });
}
