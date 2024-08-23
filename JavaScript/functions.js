function sendXMLHttpRequest(method, url, header, data = null, doneCallback, failCallback) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function () {
        if (doneCallback && this.readyState === 4 && this.status === 200) {
            doneCallback(this.responseText);
        }
        if (failCallback && this.readyState === 4 && this.status !== 200 && this.status !== 0) {
            failCallback(this.responseText);
        }
    });

    xhr.open(method, url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (header) {
        Object.keys(header).forEach(key => {
            xhr.setRequestHeader(key, header[key]);
        });
    }
    xhr.send(data);
}

export {sendXMLHttpRequest}