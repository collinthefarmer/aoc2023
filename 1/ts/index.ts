// doc consists of lines of text
// each line originally contained calibration value
// each value is now the first & last digit of line combined to form 2-digit num
// return sum of all calibration values

const input = await Bun.file("../input.txt").text();

function main() {
    const lines = input.split("\n");
    const sum = lines.reduce((acc, cur) => acc + getLineValue(cur), 0);
    console.log(sum);
}

const digits = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
];

const wordDigits = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
];

// optimization todo: once first n has been found at i, 
// start from end of string to find last digit. 
// i.e., for ( j = len; j > i; j--) { ... }
function lineDigits(line: string): number[] {
    const lineDigs: number[] = [];

    let lineLen = line.length;
    let i = 0;
    for (i; i < lineLen; i++) {
        if (digits.includes(line[i])) {
            lineDigs.push(parseInt(line[i]));
            continue;
        }
        
        let n = 1;
        for (const wd of wordDigits) {
            if (line.substring(i, i + wd.length) === wd) {
                lineDigs.push(n);
                continue;
            }
            n++;
        }
    }

    return lineDigs;
}


function getLineValue(line: string): number {
    const stripped = lineDigits(line);
    return (stripped[0] * 10 + stripped[stripped.length - 1]) || 0;
}


main();

