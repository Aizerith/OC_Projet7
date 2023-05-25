function successPosition(position) {
    return [position.coords.latitude, position.coords.longitude];
}

export async function getUserPos() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            console.log("dans getcurrentposition")
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
