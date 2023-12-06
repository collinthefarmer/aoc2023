// add up all the part numbers in the engine schematic
// any number adjacent to a symbol (ex. periods), 
// even diagonally, is a part number
/*

ex:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

114 and 58 are not part numbers, every other number is
some of the part numbers is 4361

    */

const symbols = "@+/=*$%#-&!^";
function isSymbol(s: string) {
    return symbols.indexOf(s) >= 0;
}

const digits = "0123456789";
function isDigit(s: string) {
    return digits.indexOf(s) >= 0;
}


function index(input: string) {
    const w = input.indexOf("\n") + 1;

    const symbols = Array(input.length).fill(null);

    const partNumbers = [];
    const gearRatios = Array(input.length).fill(null);
       
    let num = "";
    let numIsPart = false;
    let numGear: number | null = null;

    let i = 0;
    let s = input.length;
    for (i; i < s; i++) {
        if (isDigit(input[i])) {
            num += input[i];
            numIsPart = numIsPart || neighbors(i, w).some(x => {
                if (symbols[x] === null) {
                    symbols[x] = isSymbol(input[x]);
                }

                if (input[x] === "*") {
                    numGear = x;
                    gearRatios[x] = gearRatios[x] || [];
                }
                   
                return symbols[x];
            });
            continue;
        }
        else {
            if (isSymbol(input[i])) {
               symbols[i] = true;
            }

            if (num) {
                const numValue = parseInt(num);
                if (numIsPart) {
                    partNumbers.push(numValue)
                };

                if (numGear !== null) {
                    gearRatios[numGear].push(numValue);
                }
                
                num = "";
                numIsPart = false;
                numGear = null;
            }
        }
    }

    return [
        gearRatios
            .filter(x => x !== null && x.length === 2)
            .map(x => x[0] * x[1]), 
        partNumbers
    ]
}

function neighbors(i: number, w: number) {
    return [
        i + 1,
        i - 1,
        i + w,
        i + w + 1,
        i + w - 1,
        i - w,
        i - w + 1,
        i - w - 1
    ]
}

async function main() {
    const input = await Bun.file("../input.txt").text();
    
    const [gearRatios, parts] = index(input);

    const partsSum = parts.reduce((a, c) => a + c, 0);
    console.log(partsSum);

    const gearsSum = gearRatios.reduce((a, c) => a + c, 0);
    console.log(gearsSum);
}

await main();
