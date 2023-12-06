// cubes either r. g. or b
// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green

// return sum of IDs of possible games

async function main() {
    const input = await Bun.file("../input.txt").text();

    let games = input.split("\n")
    games.pop(); // pop off the last element because it's empty
    games = games.map(s => s.split(":")[1]);
    
    const gamesSets: [number, number, number][][] = games.map(g => extractSets(g));

    const possibleGames: number[] = gamesSets
        .map((g, i) => [g, i + 1] as const)
        .filter(g => g[0].every(s => isSetPossible(s)))
        .map(g => g[1]); // + 1 because we're summing IDs that start at 1

    const possibleGamesSum =  possibleGames.reduce((acc, cur) => acc + cur, 0); 
    console.log(possibleGamesSum);
    

    const minNeededSets = gamesSets.map(
        g => g.reduce((acc, cur) => [
            Math.max(cur[0], acc[0]),
            Math.max(cur[1], acc[1]),
            Math.max(cur[2], acc[2])
        ], [0, 0, 0]));

    const minNeededPowerSum = minNeededSets
        .reduce(
            (acc, cur) => acc + cur.reduce((acc, cur) => acc * cur, 1), 0
    )


    console.log(minNeededPowerSum);
   // let i = 0;
   // let s = games.length;
   // for (i; i < s; i++) {

   //     if (!gameContent) { continue; }
   //     gameSets.push(extractSets(gameContent));
   //     if (gameIsPossible) {
   //         possibleGames.push(i);
   //     }
   // }

   // const idSum = possibleGames.reduce((acc, cur) => acc + cur + 1, 0); // + 1 because we're summing IDs that start at 1
   // const powerSum = 

   // console.log(idSum);
}


function extractSets(gameString: string): [number, number, number][] {
    // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green

    let sets: [number, number, number][] = [[0, 0, 0]];
    
    let ctString: string = "0";

    let i = 0;
    let s = gameString.length;
    for (i; i < s; i++) {
        const char = gameString[i];
        if (!isNaN(parseInt(char))) {
            ctString += char;
            continue;
        }

        switch(gameString[i]) {
            case "r":
                sets[0][0] = parseInt(ctString);
                ctString = "0";
                i += 2;
                break;

            case "g":
                sets[0][1] = parseInt(ctString);
                ctString = "0";
                i += 4;
                break;

            case "b":
                sets[0][2] = parseInt(ctString);
                ctString = "0";
                i += 3;
                break;

            case ";":
                sets.unshift([0, 0, 0]);
                break;
            
            default:
                break;
        }
    }

    return sets;
}

// games possible if: 12 red cubes, 13 green cubes, 14 blue cubes
function isSetPossible(set: [number, number, number]): boolean {
    return set[0] <= 12 && set[1] <= 13 && set[2] <= 14;
}

await main();


// console.log(isSetPossible(extractSets(" 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green")[3]));
//console.log(extractSets(" 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue"));

