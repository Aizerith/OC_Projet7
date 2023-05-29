function successPosition(position) {
    return [position.coords.latitude, position.coords.longitude];
}

export async function noticeMessage(message) {
    let noticeElt = document.getElementById("notice");
    noticeElt.textContent = message;
    noticeElt.classList.toggle('active');
    setTimeout(() => {
        noticeElt.textContent = "";
        noticeElt.classList.toggle('active');
    }, 3000);
}

export async function getUserPos() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve(successPosition(position));
        })
    })
}

export async function getGeoStatus() {
    if (!navigator.geolocation) {
        return false;
    }
    const res = await navigator.permissions.query({ name: "geolocation" });
    const status = res.state;
    const result = status === 'denied' ? false : true;
    return result;
}
