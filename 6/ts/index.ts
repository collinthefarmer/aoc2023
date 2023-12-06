// toy boat has starting speed of 0 mm/ms
// top digit in race column of input represents time allotted in race
// bottom digit in race column of input represents record time for that race
// for each ms of hold, speed of boat (at button release) increases by 1 mm/ms
// speed = x mm/ms 
// where x is time held
// distance = speed * (t - x)
// where t is time allotted
// thus: distance = x(t - x);
//
// pt. 1:
// for each race, find the size of the set of all x's 
// such that distance > record
// answer is product of set sizes for each race
//
// x(t-x) > r
// (r/x) + x - t > 0
//
// size of set will be diff of roots
// roots are:
// floor(1/2 * (t + sqrt(t^2 - 4r))) 
// floor(1/2 * (t - sqrt(t^2 - 4r))) 

function main(input: string) {

    // pt 1.
    const races = splitRaces(input);
    const options = races.map(r => raceOptions(r));
    const product = options.reduce((acc, cur) => acc * cur, 1);
    console.log(product);

    // pt 2.
    const merged = mergeRaces(races);
    const mergedOptions = raceOptions(merged);
    console.log(mergedOptions);
}

function splitRaces(input: string): [number, number][] {
    const lines = input.split("\n");
//    lines.pop();

    const values: string[][] = lines.map(l => l.match(/\d+/g)!);
    
    const races = [];
    for (let i = 0; i < values[0].length; i++) {
        races.push([
            parseInt(values[0][i]), 
            parseInt(values[1][i])
        ] as [number, number])
    }

    return races;
}

function mergeRaces(races: [number, number][]): [number, number] {
    return races.reduce((acc, cur) => {
        acc[0] += String(cur[0]);
        acc[1] += String(cur[1]);
        return acc;
    }, ["", ""] as [string, string]).map(s => parseInt(s)) as [number, number];
}

function raceOptions(race: [number, number]): number {
    let [t, r] = race;
    t -= .001;
    const raceRoots = [
        Math.floor((t - Math.sqrt(t ** 2 - 4 * r)) / 2),
        Math.floor((t + Math.sqrt(t ** 2 - 4 * r)) / 2)
    ]
    return raceRoots[1] - raceRoots[0];
}

const inputText = await Bun.file("../input.txt").text();

const testText = `Time:      7  15   30
Distance:  9  40  200`;
main(inputText);
