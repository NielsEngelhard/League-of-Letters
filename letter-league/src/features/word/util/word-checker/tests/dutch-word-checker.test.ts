import { LanguageWordCheckerFactory } from "../language-word-checker";

describe("checkIfWordLooksLikeARealWord should return true with valid attempts", () => {
    
    const validAttempts = [
        "vis", "pan", "kip", "koe", "aap",
        "soep", "klok", "klak", "taal", "koek",
        "taart", "stoel", "snoep", "broek", "vloer",
        "schop", "kaars", "plank", "vogel", "garen",
        "klinker", "staart", "spiegel", "snijden", "banaan",
        "aardbei", "wortels", "tomaten", "glasbak", "ijsblok",
        "ansjovis", "stoelpoot", "theekrans", "schoorlap", "druiventak",
        "bloemkool", "waterglas", "keukenrol", "zonnehoed", "ijsbergjes",
        "plantenbak", "handschoenen", "fietsverhuur", "schoolplein", "koffiemolen",
        "watermeloenen", "stoofschotels", "keukenstoelen", "schaatsbanen", "bloemenwinkel"
    ];
    
    test.each(validAttempts)("Validate scenario %s", (word) => {
        const checker = LanguageWordCheckerFactory.getChecker("nl");
        const result = checker.looksLikeRealWord(word);
        expect(result).toBeTruthy();
    });
});    

describe("checkIfWordLooksLikeARealWord should return false with invalid attempts", () => {
    
    const invalidAttempts = [
        "xop", "qip", "baf", "vuv", "jol", 
        "soup", "klokz", "truk", "wazz", "bluf",
        "taorz", "stuel", "snupf", "briek", "vlork",
        "schopz", "kaarss", "plonck", "vuggel", "garzn",
        "klunker", "staorf", "spiegol", "snijder", "banann", 
        "aardbii", "wortalz", "tomatzn", "glosbak", "ijsblokz",
        "ansjovix", "stoelpoet", "theekranz", "schoorlap", "druiwntak",
        "bloemkooi", "waterglaz", "keukenrul", "zonnehod", "ijsbergjez",
        "plantenbax", "handschoenx", "fietsverhuuz", "schoolpleijn", "koffiemoolen",
        "watermeloenx", "stoofschotlz", "keukenstoelz", "schaatsbanenz", "bloemenwinkle"
    ];

    test.each(invalidAttempts)("Validate scenario %s", (word) => {
        const checker = LanguageWordCheckerFactory.getChecker("nl");
        const result = checker.looksLikeRealWord(word);
        expect(result).toBeFalsy();
    });
});    