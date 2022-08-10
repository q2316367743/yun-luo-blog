export default  {

    uint8ArrayToString(arr: Uint8Array): string {
        // let dataString = "";
        // for (let i = 0; i < arr.length; i++) {
        //     dataString += String.fromCharCode(arr[i]);
        // }
        return new TextDecoder('utf-8').decode(arr);

    }

}