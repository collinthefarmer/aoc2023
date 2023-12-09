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
    const hands = splitHands(inputText);

    hands.sort(compareHands);
    console.log(hands);

    // pt. 1
    const handWinnings = hands.map((h, i) => h[1] * (i + 1));
    const winningsSum = handWinnings.reduce((a, c) => a + c, 0);

    console.log(winningsSum);
}

type CardHand = [string, number, number];
function splitHands(inputText: string): CardHand[] {
    return inputText
        .split("\n")
        .map(h => {
            const [hand, bid] = h.split(" ");
            return [
                hand, 
                handValue(hand),
                parseInt(bid)
            ];
        });
}

function handValue(h: string): number {
    const cards = {
        "A": 0,
        "K": 0,
        "Q": 0,
        "J": 0,
        "T": 0,
        "9": 0,
        "8": 0,
        "7": 0,
        "6": 0,
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
    };

    for (const c of h) {
        cards[c as keyof typeof cards] += 1;
    }

    const counts = Object.values(cards);
    counts.sort((a, b) => a < b ? 1 : -1 * +(a !== b));

    switch (counts[0]) {
        case (5):
            return 7;

        case (4):
            return 6;

        case (3):
            return 4 + +(counts[1] === 2);

        case (2):
            return 2 + +(counts[1] === 2);

        default:
            return 1;
    }
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
main(testInput);
