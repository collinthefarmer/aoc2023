// each card has two lists of numbers separated by bar:
// list of winning numbers | numbers you have
// first match makes the card worth one point, each match after doubles value
// how many points are all cards worth in total

/*
    * ex:
    *
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53 ; 48, 83, 17, & 86, 8 points
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19 ; 32 & 61, 2 points
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1 ; 1 & 21, 2 points
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83 ; 84, 1 point
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36 ; none
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11 ; none
    *
        * so total cards are worth 13 points
    *
*/

const digits = "0123456789";
function isDigit(s: string) {
    return digits.indexOf(s) >= 0;
}

async function main(inputText: string) {
    const cards = inputText.split("\n");
    cards.pop(); // pop empty line
    
    // pt. 1
    const cardSum = cards.reduce((a, c) => a + cardPoints(c), 0);
//   console.log(cardSum);

    // pt. 2
    const cardMatches = cards.map(c => readCardMatches(c));
    console.log(countCopiedCards(cardMatches));
}


function cardPoints(cardString: string): number {
    cardString = cardString.split(":")[1] + " "; // split to remove 'Card X:'
                                                 // add space to force check
    const winningNumbers: string[] = [];

    let points = 0;

    let n = "";
    let checkFlag = false;
    for (const char of cardString) {
        if (isDigit(char)) {
            n += char;
        } else if (char === "|") {
            checkFlag = true;
        } else if (n) {
            if (checkFlag && winningNumbers.includes(n)) {
                points = !points ? 1 : points * 2;
            } else if (!checkFlag) {
                winningNumbers.push(n);
            }
            n = "";
        }
    }

    return points;
}


function readCardMatches(cardString: string) {
    cardString = cardString.split(":")[1] + " "; // split to remove 'Card X:'
                                                 // add space to force check
    const winningNumbers: string[] = [];

    let points = 0;

    let n = "";
    let checkFlag = false;
    for (const char of cardString) {
        if (isDigit(char)) {
            n += char;
        } else if (char === "|") {
            checkFlag = true;
        } else if (n) {
            if (checkFlag && winningNumbers.includes(n)) {
                points += 1;
            } else if (!checkFlag) {
                winningNumbers.push(n);
            }
            n = "";
        }
    }

    return points;
}

function countCopiedCards(cardMatches: number[]): number {
    let ct = 0;
    function explodeCard(index: number) {
        for (let i = 0; i < cardMatches[index]; i++) {
            ct++;
            explodeCard(index + i + 1);
        }
    }

    let i = 0;
    let s = cardMatches.length;

    for (i; i < s; i++) {
        explodeCard(i);
        ct++;
    }

    return ct;
}

const input = await Bun.file("../input.txt").text();
main(input);

//const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
//Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
//Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
//Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
//Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
//Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
//`;
//
//main(testInput);
