export const findRandomRange = function (list) {
    let randomRang = list[0];
    if (list.length > 1) {
        randomRang = list[Math.floor(Math.random() * list.length)];
    }
    return randomRang
}