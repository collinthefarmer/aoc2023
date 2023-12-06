// values in each category are maps to convert one category to another
// each value is three numbers:
// destination range start, source range start, and range length
// ex: 50 98 2 in seed-to-soil map
// - meaning source range starts at 98 and has two values: 98 and 99
// - meaning dest. range starts at 50 and has two values: 50 and 51
//
// * any source numbers that aren't mapped correspond to the SAME dest. number


// pt. 1: find lowest location number that corresponds to any of initial seeds


function main(inputText: string) {
    const [seeds, ...maps] = inputText.split("\n\n");
    
    const mapFunctions = maps
        .map(m => parseMapFunction(m));
    const seedToLocation = mapFunctions
        .reduce((acc, cur) => (value: number) => cur(acc(value)));

    // pt. 1
    const seedNumbers = parseSeeds(seeds);
    const lowestLocation = Math.min(...seedNumbers.map(s => seedToLocation(s)));
//    console.log(lowestLocation);

    // pt. 2

    const seedRanges = parseSeedsAsRanges(seeds);
    const lowestPossibleLocation = mapFunctions[mapFunctions.length - 1](0);

    const start = seedRanges[0][0];
    const end = seedRanges[seedRanges.length - 1][1];

    const n = end - start;
    
    let lastTime = performance.now();

    // logging
    const logPeriod = 10000000;

    let k = 0;
    let r = seedRanges[k];
    let min = Number.MAX_SAFE_INTEGER;
//    console.log(`MIN: ${min}`)
    for (let i = start; i < end; i++) {
        if (i >= r[0] && i <= r[1]) {
            min = Math.min(min, 0); //seedToLocation(i));
            if (i % logPeriod === 0) {
                let now = performance.now();
                process.stdout.write(`${(i - start).toLocaleString("en-us")} of ${n.toLocaleString("en-us")} | ${((i - start) * 100/ n).toFixed(2)}% | ${((now - lastTime) / logPeriod).toFixed(2)} secs. per period | min: ${min}\r`);
                lastTime = now
            }
        } else {
            r = seedRanges[k++];
            console.log(k);
            i = r[0]
        }
    }
    
    console.log(`min: ${min}`);
}

function parseSeeds(seedsText: string): number[] {
    seedsText = seedsText.split(": ")[1];
    return seedsText.split(" ").map(n => parseInt(n));
}

function parseSeedsAsRanges(seedsText: string): [number, number][] {
    seedsText = seedsText.split(": ")[1];
    const rangeComponents = seedsText.split(" ").map(n => parseInt(n));
    
    const seedRanges: [number, number][] = [];
    for (let i = 0; i < rangeComponents.length; i += 2) {
        let [l, n] = rangeComponents.slice(i, i + 2);
        seedRanges.push([l, l + n]);
    }
    seedRanges.sort((a, b) => a[1] < b[1] ? -1 : +(a[1] !== b[1]));
    
    return seedRanges;
}

function parseMapFunction(mapText: string) {
    const [name, content] = mapText.split("map:\n");
    const mappings: [number, number, number][] = content
        .split("\n")
        .map(l => l.split(" ").map(n => parseInt(n)) as [number, number, number])
        .sort((a, b) => a[1] < b[1] ? 1 : -1); // sort desc. based on src. range
//  I think the lookup is actually making it incredibly slow?    
//    const lookup: Record<number, number> = {};
    return (value: number): number => {
        for (const mapping of mappings) {
            if (mapping[1] <= value) {
                return applyMapping(value, mapping);
//                console.log(`${name}: ${value} -> ${mappedValue} with ${mapping}`);
//                console.log(mappings);
            }
        }
//        console.log(`${name}: no mapping found for ${value}`)
        return value;
    }   
}

function applyMapping(value: number, mapping: [number, number, number]): number {
    const [dest, src, rng] = mapping;
    
    const max = src + rng - 1;
    if (value > max) {
        return value;
    }

    const offset = value - src;
    return dest + offset;
}

 const input = await Bun.file("../input.txt").text();
 main(input);
    
//
//const testInput = `seeds: 79 14 55 13
//
//seed-to-soil map:
//50 98 2
//52 50 48
//
//soil-to-fertilizer map:
//0 15 37
//37 52 2
//39 0 15
//
//fertilizer-to-water map:
//49 53 8
//0 11 42
//42 0 7
//57 7 4
//
//water-to-light map:
//88 18 7
//18 25 70
//
//light-to-temperature map:
//45 77 23
//81 45 19
//68 64 13
//
//temperature-to-humidity map:
//0 69 1
//1 0 69
//
//humidity-to-location map:
//60 56 37
//56 93 4`
//main(testInput);
