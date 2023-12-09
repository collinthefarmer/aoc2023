// list of hands
// order hands by strength
// hands consist of 5 cards
// each card labled one of: AKQJT98765432 (from highest to lowest)
// each hand is exactly one type (from highest to lowest): 
//  - five of a kind
//  - four of a kind
//  - full house
//  - three of a kind
//  - two pair
//  - one pair
//  - high card
// hands are usually compared by type, but if two have the same type:
// start by comparing first card in each hand: 
// if different, hand with higher card wins
// continue with this until every subsequent card has been compared
// each hand is followed by its bid amount
// hand wins an amount equal to its bid amount times its rank
// where weakest hand is rank 1 and strongest hand is rank N (N being num of hands)
//
// pt.1 
// basically just need to sort list by hand strength


function main(inputText: string): void {

    // pt. 1
    const hands = splitHands(inputText, handValue);
    hands.sort(compareHands);
    const handWinnings = hands.map((h, i) => h[2] * (i + 1));
    const winningsSum = handWinnings.reduce((a, c) => a + c, 0);
    console.log(winningsSum);
    
    // pt. 2
    const hands2 = splitHands(inputText, handValue2)
    hands2.sort(compareHands);
    const handWinnings2 = hands2.map((h, i) => h[2] * (i + 1));
    const winningsSum2 = handWinnings2.reduce((a, c) => a + c, 0);
    console.log(winningsSum2)
}

type CardHand = [string, number, number];
function splitHands(inputText: string, valueFn: (s: string) => number): CardHand[] {
    return inputText
        .trimEnd()
        .split("\n")
        .map(h => {
            const [hand, bid] = h.split(" ");
            return [
                hand, 
                valueFn(hand),
                parseInt(bid)
            ];
        });
}

const cardLabels = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A"
]


function handValue(h: string): number {
    const cards: Record<typeof h[number], number> = {};
    
    let value = 0x0;
    
    // calculate value based off card value & position
    let i = 0;
    const s = 5; // SIZE OF HAND (constant)
    for (i; i < s; i++) {
        const c = h[i];
        value += cardLabels.indexOf(c) * (16 ** (s - i - 1));
        cards[c] = (cards[c] ?? 0) + 1;
    }

    const counts = Object.values(cards);
    counts.sort((a, b) => a < b ? 1 : -1 * +(a !== b));
    
    // adjust value based on hand type
    switch (counts[0]) {
        case (5):
            value += 0x700000;

        case (4):
            value += 0x600000;

        case (3):
            value += 0x400000 + 0x100000 * +(counts[1] === 2);

        case (2):
            value += 0x200000 + 0x100000 * +(counts[1] === 2);

        default:
            value += 0x100000;
    }
    return value
}


const cardLabels2 = [
    "J",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "Q",
    "K",
    "A"
]

function handValue2(h: string): number {
    const cards: Record<typeof h[number], number> = {};
    
    let value = 0x0;
    
    // calculate value based off card/card position
    // use hex because it lets us have 1 digit per position, 
    // and fits the required 12 possible values per position
    let i = 0;
    const s = 5; // SIZE OF HAND (constant)
    for (i; i < s; i++) {
        const c = h[i];
        value += cardLabels2.indexOf(c) * (0x10 ** (s - i - 1));
        cards[c] = (cards[c] ?? 0) + 1;
    }
    
    let jCount = cards["J"] ?? 0;
    if (jCount) {
        delete cards["J"];
    }

    const counts = Object.values(cards);
    counts.sort((a, b) => a < b ? 1 : -1 * +(a !== b));
    // adjust value based on hand type
    switch (jCount === 5 ? 5 : counts[0] + jCount) {
        case (5):
            value += 0x700000;

        case (4):
            value += 0x600000;

        case (3):
            value += 0x400000 + 0x100000 * +(counts[1] === 2);

        case (2):
            value += 0x200000 + 0x100000 * +(counts[1] === 2);

        default:
            value += 0x100000;
    }
    return value
}

function compareHands(a: CardHand, b: CardHand): number {
    return a[1] > b[1] ? 1 : -1 * +(a !== b);
}

const input = await Bun.file("../input.txt").text();
const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
main(input);
