export default  {

    uint8ArrayToString(arr: Uint8Array): string {
        if (!arr) {
            return "";
        }
        return new TextDecoder('utf-8').decode(arr);

    }

}