const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');
const fkill = require('fkill');

describe('Flow Dapp Tests', async() => {
    let config = null;
    before('setup contract', async() => {
        // Setup tasks for tests
        config = DappLib.getConfig();
    });

    after(() => {
        fkill(':3570');
    });

    /************ Character X ************/
    describe('Character X Tests', async() => {

        it(`0. Set up accounts`, async() => {

            let testData0 = {
                signer: config.accounts[0]
            }

            let testData1 = {
                signer: config.accounts[1]
            }

            let testData2 = {
                signer: config.accounts[2]
            }

            let testData3 = {
                signer: config.accounts[3]
            }

            let testData4 = {
                signer: config.accounts[4]
            }

            await DappLib.characterxSetupAccount(testData0)
            await DappLib.characterxSetupAccount(testData1)
            await DappLib.characterxSetupAccount(testData2)
            await DappLib.characterxSetupAccount(testData3)
            await DappLib.characterxSetupAccount(testData4)

        });
        it(`1. Create an "Admin set" (Set ID = 0)`, async() => {
            let testData1 = {
                signer: config.accounts[0],
                setName: "Admin set"
            }

            try {
                await DappLib.characterxCreateSet(testData1)
            } catch (e) {
                // The first set ID is 0
                let res = await DappLib.characterxGetSetName(0)
                assert.equal(res.result, "Admin set", "Incorrect. Set name should be Admin set")
                console.log("❗Unable to create a set from Admin account")
            }


        });


        it(`2. Can not create a Non Admin set`, async() => {
            let testData2 = {
                signer: config.accounts[1],
                setName: "Non admin set"
            }

            try {
                await DappLib.characterxCreateSet(testData2)
            } catch (e) {
                let res = await DappLib.characterxSetsGetNextSetID({})
                assert.equal(res.result, 1, "❗Incorrect. The set name + next set ID should not been created by non Admin account")
            }
        });

        it(`3. Get set name for Admin set`, async() => {
            let setID = 0
            let res1 = await DappLib.characterxGetSetName({ setID })
            assert.equal(res1.result, "Admin set", "❗Incorrect set name")
            console.log("Set ID " + setID + " name: " + res1.result)


        });

        it(`4. Create a character (Admin)`, async() => {
            let testData1 = {
                signer: config.accounts[0],
                name: "Willi Blue",
                description: "Character with the coolest name ever",
                image: "URL",
                createdFrom_1: "0",
                createdFrom_2: "0",
                sex: "Male",
                race: "Yellow",
                rarity: "Fancy Intense",
                lineage: [{ key: "Targaryen", value: true }],
                bloodline: [{ key: "O", value: false }],
                element: [{ key: "Fire", value: true }],
                traits: [{ key: "Traits", value: "Traits.." }, { key: "Traits 2", value: "Traits.. 2" }],
                data: [{ key: "Data", value: "Data.." }]
            }


            await DappLib.characterxCreateCharacter(testData1)

            assert.equal(testData1.name, "Willi Blue", "❗Incorrect. The charcter's name should be: Willi Blue")
            assert.equal(testData1.description, "Character with the coolest name ever", "❗Incorrect. The character's description should be: Character with the coolest name ever")
            assert.equal(testData1.image, "URL", "❗Incorrect. The character's image should be: URL")
            assert.equal(testData1.createdFrom_1, 0, "❗Incorrect. The character's createdFrom_1 should be: 0")
            assert.equal(testData1.createdFrom_2, 0, "❗Incorrect. The character's createdFrom_2 should be: 1")
            assert.equal(testData1.sex, "Male", "❗Incorrect. The character's sex should be: Male")
            assert.equal(testData1.race, "Yellow", "❗Incorrect. The character's race should be: Yellow")
            assert.equal(testData1.rarity, "Fancy Intense", "❗Incorrect. The character rarity should be: Fancy Intense")
            assert.equal(testData1.lineage[0].key, "Targaryen", "❗Incorrect. The character's lineage's key should be: Targaryen")
            assert.equal(testData1.lineage[0].value, true, "❗Incorrect. The character's lineage's value should be: true")
            assert.equal(testData1.bloodline[0].key, "O", "❗Incorrect. The character's bloodline's key should be: O")
            assert.equal(testData1.bloodline[0].value, false, "❗Incorrect. The character's bloodline's value should be: false")
            assert.equal(testData1.element[0].key, "Fire", "❗Incorrect. The character's element's key should be: Fire")
            assert.equal(testData1.element[0].value, true, "❗Incorrect. The character's element's value should be: true")
            assert.equal(testData1.traits[0].key, "Traits", "❗Incorrect. The character's traits's key should be: Traits")
            assert.equal(testData1.traits[0].value, "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
            assert.equal(testData1.traits[1].key, "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
            assert.equal(testData1.traits[1].value, "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
            assert.equal(testData1.data[0].key, "Data", "❗Incorrect. The character's data's key should be: Data")
            assert.equal(testData1.data[0].value, "Data..", "❗Incorrect. The character's data's value should be: Data..")

        });

        // As Admin has created a character with characterID = 0. Next characterID should be 1
        it(`5. Has correct next character ID - Script`, async() => {
            let res1 = await DappLib.characterxCharactersGetNextCharacterID({})
            assert.equal(res1.result, 1, "❗Incorrect. The next character ID should be 1")
            console.log("Next characterID should be: " + res1.result)


        });

        it(`6. Create a character (Non Admin)`, async() => {
            let testData1 = {
                signer: config.accounts[1],
                name: "Twice",
                description: "Once",
                image: "URL",
                createdFrom_1: "0",
                createdFrom_2: "0",
                sex: "Female",
                race: "Asian",
                rarity: "JYP",
                lineage: [{ key: "Twicecoaster", value: true }],
                bloodline: [{ key: "Korean", value: false }],
                element: [{ key: "Japan", value: true }],
                traits: [{ key: "China", value: "China.." }],
                data: [{ key: "Data", value: "Data.." }]
            }

            try {
                await DappLib.characterxCreateCharacter(testData1)

            } catch (e) {
                // As Non Admin account should not be able to create a character and the Next character ID should remain 1
                let res = await DappLib.characterxCharactersGetNextCharacterID({})
                assert.equal(res.result, 1, "❗Incorrect. The next character ID should be 1")
            }

        });

        it(`7. Create a second character (Admin)`, async() => {
            let testData1 = {
                signer: config.accounts[0],
                name: "Willi Blue",
                description: "Character with the coolest name ever",
                image: "URL",
                createdFrom_1: "0",
                createdFrom_2: "0",
                sex: "Male",
                race: "Yellow",
                rarity: "Fancy Intense",
                lineage: [{ key: "Targaryen", value: true }, { key: "Stark", value: false }],
                bloodline: [{ key: "O", value: false }],
                element: [{ key: "Fire", value: true }],
                traits: [{ key: "Traits", value: "Traits.." }, { key: "Traits 2", value: "Traits.. 2" }],
                data: [{ key: "Data", value: "Data.." }]
            }


            await DappLib.characterxCreateCharacter(testData1)

            assert.equal(testData1.name, "Willi Blue", "❗Incorrect. The charcter's name should be: Willi Blue")
            assert.equal(testData1.description, "Character with the coolest name ever", "❗Incorrect. The character's description should be: Character with the coolest name ever")
            assert.equal(testData1.image, "URL", "❗Incorrect. The character's image should be: URL")
            assert.equal(testData1.createdFrom_1, 0, "❗Incorrect. The character's createdFrom_1 should be: 0")
            assert.equal(testData1.createdFrom_2, 0, "❗Incorrect. The character's createdFrom_2 should be: 1")
            assert.equal(testData1.sex, "Male", "❗Incorrect. The character's sex should be: Male")
            assert.equal(testData1.race, "Yellow", "❗Incorrect. The character's race should be: Yellow")
            assert.equal(testData1.rarity, "Fancy Intense", "❗Incorrect. The character rarity should be: Fancy Intense")
            assert.equal(testData1.lineage[0].key, "Targaryen", "❗Incorrect. The character's lineage's key should be: Targaryen")
            assert.equal(testData1.lineage[0].value, true, "❗Incorrect. The character's lineage's value should be: true")
            assert.equal(testData1.lineage[1].key, "Stark", "❗Incorrect. The character's lineage's key should be: Stark")
            assert.equal(testData1.lineage[1].value, false, "❗Incorrect. The character's lineage's value should be: false")
            assert.equal(testData1.bloodline[0].key, "O", "❗Incorrect. The character's bloodline's key should be: O")
            assert.equal(testData1.bloodline[0].value, false, "❗Incorrect. The character's bloodline's value should be: false")
            assert.equal(testData1.element[0].key, "Fire", "❗Incorrect. The character's element's key should be: Fire")
            assert.equal(testData1.element[0].value, true, "❗Incorrect. The character's element's value should be: true")
            assert.equal(testData1.traits[0].key, "Traits", "❗Incorrect. The character's traits's key should be: Traits")
            assert.equal(testData1.traits[0].value, "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
            assert.equal(testData1.traits[1].key, "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
            assert.equal(testData1.traits[1].value, "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
            assert.equal(testData1.data[0].key, "Data", "❗Incorrect. The character's data's key should be: Data")
            assert.equal(testData1.data[0].value, "Data..", "❗Incorrect. The character's data's value should be: Data..")

        });

        // As Admin has created 2 characters. Next characterID should be 2
        it(`8. Has correct next character ID`, async() => {
            let res1 = await DappLib.characterxCharactersGetNextCharacterID({})
            assert.equal(res1.result, 2, "❗Incorrect. The next character ID should be 1")
            console.log("Next character ID should be 2: " + res1.result)

        });

        it(`9. Get characterID 1's multiple traits`, async() => {
            let characterID = 1
            let res1 = await DappLib.characterxCharactersGetCharacterTraits({ characterID })
            console.log("Character " + characterID + "'s traits is: " + JSON.stringify(res1.result))
        });

        it(`10. Get characterID 0's data`, async() => {
            let characterID = 0
            let res1 = await DappLib.characterxCharactersGetCharacterData({ characterID })
            console.log("Character's " + characterID + "'s data is " + JSON.stringify(res1.result))

        });

        it(`11. Get characterID 0's data field (value)`, async() => {
            let characterID = 0
            let field = "Data"
            let res1 = await DappLib.characterxCharactersGetCharacterDataField({ characterID, field })
            console.log("Character's " + characterID + "'s data is " + JSON.stringify(res1.result))

        });

        it(`12. Get characterID 0's traits field (value)`, async() => {
            let characterID = 0
            let field = "Traits"
            let res1 = await DappLib.characterxCharactersGetCharacterTraitsField({ characterID, field })
            console.log("Character's " + characterID + "'s traits field is " + JSON.stringify(res1.result))

        });

        it(`13. Get characters in setID 0 - before adding any`, async() => {
            let setID = 0
            let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
            assert.deepEqual(res1.result, [], "❗Incorrect. setID 0 should be empty")
            console.log("Before adding any. Character(s) in " + setID + ": " + JSON.stringify(res1.result))

        });

        it(`14. Can not add characterID 0 to setID 0 - Non Admin`, async() => {

            let testData1 = {
                signer: config.accounts[1],
                setID: "0",
                characterID: "0"
            }

            try {
                await DappLib.characterxAddCharacterToSet(testData1)
            } catch (e) {
                let res1 = await DappLib.characterxSetsGetCharactersInSet(testData1)
                assert.deepEqual(res1.result, [], "❗Incorrect. setID 0 should be empty")
                console.log("Could not add the character " + testData1.characterID + " to set: " + testData1.setID)
            }


        });

        it(`15. Add characterID 0 to setID 0 - Admin`, async() => {

            let testData1 = {
                signer: config.accounts[0],
                setID: "0",
                characterID: "0"
            }

            try {
                await DappLib.characterxAddCharacterToSet(testData1)
            } catch (e) {
                let res1 = await DappLib.characterxSetsGetCharactersInSet(parseInt(testData1.setID))
                assert.deepEqual(res1.result, [0], "❗Incorrect. setID 0 should contain characterID 0")
            }
        });


        it(`16. Get characters in setID 0`, async() => {
            let setID = 0
            let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
            assert.deepEqual(res1.result, [0], "❗Incorrect. setID 0 should only contain characterID 0")
            console.log("Character(s) in " + setID + ": " + JSON.stringify(res1.result))

        });

        it(`17. Create a third character (Admin)`, async() => {
            let testData1 = {
                signer: config.accounts[0],
                name: "Willi Blue the 3rd",
                description: "Character with the coolest name ever",
                image: "URL",
                createdFrom_1: "0",
                createdFrom_2: "0",
                sex: "Male",
                race: "Yellow",
                rarity: "Fancy Intense",
                lineage: [{ key: "Targaryen", value: true }],
                bloodline: [{ key: "O", value: false }],
                element: [{ key: "Fire", value: true }],
                traits: [{ key: "Traits", value: "Traits.." }, { key: "Traits 2", value: "Traits.. 2" }],
                data: [{ key: "Data", value: "Data.." }]
            }


            await DappLib.characterxCreateCharacter(testData1)

            assert.equal(testData1.name, "Willi Blue the 3rd", "❗Incorrect. The charcter's name should be: Willi Blue")
            assert.equal(testData1.description, "Character with the coolest name ever", "❗Incorrect. The character's description should be: Character with the coolest name ever")
            assert.equal(testData1.image, "URL", "❗Incorrect. The character's image should be: URL")
            assert.equal(testData1.createdFrom_1, 0, "❗Incorrect. The character's createdFrom_1 should be: 0")
            assert.equal(testData1.createdFrom_2, 0, "❗Incorrect. The character's createdFrom_2 should be: 1")
            assert.equal(testData1.sex, "Male", "❗Incorrect. The character's sex should be: Male")
            assert.equal(testData1.race, "Yellow", "❗Incorrect. The character's race should be: Yellow")
            assert.equal(testData1.rarity, "Fancy Intense", "❗Incorrect. The character rarity should be: Fancy Intense")
            assert.equal(testData1.lineage[0].key, "Targaryen", "❗Incorrect. The character's lineage's key should be: Targaryen")
            assert.equal(testData1.lineage[0].value, true, "❗Incorrect. The character's lineage's value should be: true")
            assert.equal(testData1.bloodline[0].key, "O", "❗Incorrect. The character's bloodline's key should be: O")
            assert.equal(testData1.bloodline[0].value, false, "❗Incorrect. The character's bloodline's value should be: false")
            assert.equal(testData1.element[0].key, "Fire", "❗Incorrect. The character's element's key should be: Fire")
            assert.equal(testData1.element[0].value, true, "❗Incorrect. The character's element's value should be: true")
            assert.equal(testData1.traits[0].key, "Traits", "❗Incorrect. The character's traits's key should be: Traits")
            assert.equal(testData1.traits[0].value, "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
            assert.equal(testData1.traits[1].key, "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
            assert.equal(testData1.traits[1].value, "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
            assert.equal(testData1.data[0].key, "Data", "❗Incorrect. The character's data's key should be: Data")
            assert.equal(testData1.data[0].value, "Data..", "❗Incorrect. The character's data's value should be: Data..")

        });

        it(`18. Create a fourth character (Admin)`, async() => {
            let testData1 = {
                signer: config.accounts[0],
                name: "Willi Blue the 4th",
                description: "Character with the coolest name ever",
                image: "URL",
                createdFrom_1: "0",
                createdFrom_2: "0",
                sex: "Male",
                race: "Yellow",
                rarity: "Fancy Intense",
                lineage: [{ key: "Targaryen", value: true }],
                bloodline: [{ key: "O", value: false }],
                element: [{ key: "Fire", value: true }],
                traits: [{ key: "Traits", value: "Traits.." }, { key: "Traits 2", value: "Traits.. 2" }],
                data: [{ key: "Data", value: "Data.." }]
            }


            await DappLib.characterxCreateCharacter(testData1)

            assert.equal(testData1.name, "Willi Blue the 4th", "❗Incorrect. The charcter's name should be: Willi Blue")
            assert.equal(testData1.description, "Character with the coolest name ever", "❗Incorrect. The character's description should be: Character with the coolest name ever")
            assert.equal(testData1.image, "URL", "❗Incorrect. The character's image should be: URL")
            assert.equal(testData1.createdFrom_1, 0, "❗Incorrect. The character's createdFrom_1 should be: 0")
            assert.equal(testData1.createdFrom_2, 0, "❗Incorrect. The character's createdFrom_2 should be: 1")
            assert.equal(testData1.sex, "Male", "❗Incorrect. The character's sex should be: Male")
            assert.equal(testData1.race, "Yellow", "❗Incorrect. The character's race should be: Yellow")
            assert.equal(testData1.rarity, "Fancy Intense", "❗Incorrect. The character rarity should be: Fancy Intense")
            assert.equal(testData1.lineage[0].key, "Targaryen", "❗Incorrect. The character's lineage's key should be: Targaryen")
            assert.equal(testData1.lineage[0].value, true, "❗Incorrect. The character's lineage's value should be: true")
            assert.equal(testData1.bloodline[0].key, "O", "❗Incorrect. The character's bloodline's key should be: O")
            assert.equal(testData1.bloodline[0].value, false, "❗Incorrect. The character's bloodline's value should be: false")
            assert.equal(testData1.element[0].key, "Fire", "❗Incorrect. The character's element's key should be: Fire")
            assert.equal(testData1.element[0].value, true, "❗Incorrect. The character's element's value should be: true")
            assert.equal(testData1.traits[0].key, "Traits", "❗Incorrect. The character's traits's key should be: Traits")
            assert.equal(testData1.traits[0].value, "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
            assert.equal(testData1.traits[1].key, "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
            assert.equal(testData1.traits[1].value, "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
            assert.equal(testData1.data[0].key, "Data", "❗Incorrect. The character's data's key should be: Data")
            assert.equal(testData1.data[0].value, "Data..", "❗Incorrect. The character's data's value should be: Data..")

        });

        it(`19. Can not add characterID 1 and 2 to setID 0  - Non Admin`, async() => {

            let testData1 = {
                signer: config.accounts[1],
                setID: "0",
                character1: "1",
                character2: "2"
            }

            try {
                await DappLib.characterxAddCharactersToSet(testData1)
            } catch (e) {
                let res1 = await DappLib.characterxSetsGetCharactersInSet(testData1)
                assert.deepEqual(res1.result, [0], "❗Incorrect. setID 0 should only contain characterID 0")
            }
        });

        it(`20. Add characterID 1 and 2 to setID 0 - Admin`, async() => {

            let testData1 = {
                signer: config.accounts[0],
                setID: "0",
                character1: "1",
                character2: "2"
            }

            let setID = 0

            await DappLib.characterxAddCharactersToSet(testData1)

            try {
                await DappLib.characterxAddCharactersToSet(testData1)
            } catch (e) {
                let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
                assert.deepEqual(res1.result, [0, 1, 2], "❗Incorrect. setID 0 should contain characterID 0, 1, 2")
            }
        });

        it(`21. Get characters in setID 0`, async() => {
            let setID = 0
            let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
            assert.deepEqual(res1.result, [0, 1, 2], "❗Incorrect. setID 0 should contain characterID 0, 1, 2")
            console.log("Character(s) in " + setID + ": " + JSON.stringify(res1.result))

        });

        // Characters with character ID 2 and 3 has already been added to set ID 0
        it(`22. Can not add character ID 2 and 3 to set ID 0`, async() => {
            let testData1 = {
                signer: config.accounts[0],
                setID: "0",
                character1: "1",
                character2: "2"
            }

            try {
                await DappLib.characterxAddCharactersToSet(testData1)
            } catch (e) {
                let res1 = await DappLib.characterxSetsGetCharactersInSet(testData1)
                assert.deepEqual(res1.result, [0, 1, 2], "❗Incorrect. setID 0 should contain characterID 0, 1, 2")
                console.log("Character ID 1 and 2 already exist in set ID 0")
            }

        });

        it(`23. Get total supply - before minting charaters`, async() => {

            let res1 = await DappLib.characterxGetTotalSupply({})
            assert.equal(res1.result, 0, "❗Incorrect. Total supply should be 0")
            console.log("Total supply is: " + res1.result)

        });

        it(`24. Can not mint characterID 0, setID 0 to accounts[2] - Non Admin`, async() => {

            let testData1 = {
                signer: config.accounts[1],
                setID: "0",
                characterID: "0",
                recipientAddr: config.accounts[2]
            }

            try {
                await DappLib.characterxMintCharacter(testData1)
            } catch (e) {
                let res1 = await DappLib.characterxGetTotalSupply({})
                assert.equal(res1.result, 0, "❗Incorrect. Total supply should be 0")
                console.log("Total supply should be 0:  " + res1.result)
            }
        });


        it(`25. Mint characterID 0, setID 0 to Admin account - Admin`, async() => {

            let testData1 = {
                signer: config.accounts[0],
                setID: "0",
                characterID: "0",
                recipientAddr: config.accounts[0]
            }

            await DappLib.characterxMintCharacter(testData1)
            let res1 = await DappLib.characterxGetTotalSupply({})
            assert.equal(res1.result, 1, "❗Incorrect. The total supply should be 1")
            console.log("Total supply should be 1:  " + res1.result)

        });
        /*
        it(`. Get collections character id`, async() => {
            let testData1 = {
                account: config.accounts[0],
                id: "0"
            }
            let res1 = await DappLib.characterxCollectionsGetCharacterCharacterID(testData1)
            assert.equal(res1.result, 0, "❗Incorrect. The character ID should be 0")
            console.log("Total collection's characterID is: " + res1.result)

        });
  
                it(`24. Get total supply`, async() => {

                    let res1 = await DappLib.characterxGetTotalSupply({})
                    assert.equal(res1.result, 1, "❗Incorrect. Total supply should be 0")
                    console.log("Total supply is: " + res1.result)

                });

                */
        /*
                it(`27. Can not batch mint characterID 1, setID 0 to accounts[2] - Non Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[1],
                        setID: "0",
                        characterID: "1",
                        quantity: "5",
                        recipientAddr: config.accounts[0]
                    }

                    try {
                        await DappLib.characterxBatchMintCharacter(testData1)
                    } catch (e) {
                        let res1 = await DappLib.characterxGetTotalSupply({})
                        assert.equal(res1.result, 2, "❗Incorrect. The total supply should be 2")
                        console.log("Total supply should be 2:  " + res1.result)
                    }
                });

                it(`28. Batch mint characterID 1, setID 0, quantity 5 to accounts[2] and Admin account - Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[0],
                        setID: "0",
                        characterID: "1",
                        quantity: "5",
                        recipientAddr: config.accounts[0]
                    }

                    let testData2 = {
                        signer: config.accounts[0],
                        setID: "0",
                        characterID: "1",
                        quantity: "5",
                        recipientAddr: config.accounts[2]
                    }

                    await DappLib.characterxBatchMintCharacter(testData1)
                    let res1 = await DappLib.characterxGetTotalSupply({})
                    assert.equal(res1.result, 7, "❗Incorrect. Total supply should be 7")
                    console.log("Total supply should be 12:  " + res1.result)

                    try {
                        await DappLib.characterxBatchMintCharacter(testData2)
                    } catch (e) {
                        let res2 = await DappLib.characterxGetTotalSupply({})
                        assert.equal(res2.result, 12, "❗Incorrect. Total supply should be 12")
                        console.log("Total supply should be 12:  " + res2.result)
                    }
                });

                it(`29. Get total supply - after minting charaters`, async() => {

                    let res1 = await DappLib.characterxGetTotalSupply({})
                    assert.equal(res1.result, 12, "❗Incorrect. Total supply should be 12")
                    console.log("Total supply is 12: " + res1.result)

                });

                it(`30. Can not retire character ID 0, setID 0 - Non Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[1],
                        setID: "0",
                        characterID: "0"
                    }

                    try {
                        await DappLib.characterxRetireCharacterFromSet(testData1)
                    } catch (e) {
                        let res1 = await DappLib.characterxSetsGetEditionRetired(testData1)
                        assert.isFalse(res1.result, "❗Incorrect. The character ID 0, set ID 0 should not be retired")
                        console.log("Retired should be false: " + res1.result)
                    }
                });

                it(`31. Retire character ID 0, setID 0 - Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[1],
                        setID: "0",
                        characterID: "0"
                    }
                    await DappLib.characterxRetireCharacterFromSet(testData1)
                    let res1 = await DappLib.characterxSetsGetEditionRetired(testData1)
                    assert.isTrue(res1.result, "❗Incorrect. The character ID 0, set ID 0 should be retired")
                    console.log("Retired should be true: " + res1.result)
                });

                it(`32. Retire character ID 0, setID 0 - Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[1],
                        setID: "0",
                        characterID: "0"
                    }
                    await DappLib.characterxRetireCharacterFromSet(testData1)
                    let res1 = await DappLib.characterxSetsGetEditionRetired(testData1)
                    assert.isTrue(res1.result, "❗Incorrect. The character ID 0, set ID 0 should be retired")
                    console.log("Retired should be true: " + res1.result)
                });

                it(`33. Can not mint character ID 0, setID 0 (retired)- Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[1],
                        setID: "0",
                        characterID: "0"
                    }
                    await DappLib.characterxRetireCharacterFromSet(testData1)
                    let res1 = await DappLib.characterxSetsGetEditionRetired(testData1)
                    assert.isTrue(res1.result, "❗Incorrect. The character ID 0, set ID 0 should be retired")
                    console.log("Retired should be true: " + res1.result)
                });
        */
    });




    /*
        describe('\nPack NFT', async () => {

            it(`mints tokens into the admin and user accounts and has the correct balance in the account`, async () => {
                let testData1 = {
                    amount: "30.0",
                    recipient: config.accounts[0]
                }
                let testData2 = {
                    amount: "30.0",
                    recipient: config.accounts[1]
                }
                let testData3 = {
                    account: config.accounts[0]
                }
                let testData4 = {
                    account: config.accounts[1]
                }

                await DappLib.mintFlowTokens(testData1)
                await DappLib.mintFlowTokens(testData2)
                let res1 = await DappLib.getFlowBalance(testData3)
                let res2 = await DappLib.getFlowBalance(testData4)

                assert.equal(res1.result, 1030.001, "Did not mint tokens correctly")
                assert.equal(res2.result, 1030.001, "Did not mint tokens correctly")
            })

            it(`provisions the admin and a user`, async () => {
                let testData1 = {
                    account: config.accounts[0]
                }
                let testData2 = {
                    account: config.accounts[1]
                }

                await DappLib.provisionNFTs(testData1);
                await DappLib.provisionNFTs(testData2);

                await DappLib.provisionPacks(testData1);
                await DappLib.provisionPacks(testData2);

                await DappLib.provisionMarketplace(testData1);
                await DappLib.provisionMarketplace(testData2);
            });

            it(`has no initial packs or nfts`, async () => {
                let testData = {
                    account: config.accounts[0]
                }
                let res1 = await DappLib.getOwnedPacks(testData);
                let res2 = await DappLib.getNFTsInCollection(testData);
                assert.equal(res1.result.length, 0, "Account provisioned incorrectly");
                assert.equal(res2.result.length, 0, "Account provisioned incorrectly");
            });

            it(`has no initial available packs to buy`, async () => {
                let res = await DappLib.getPacksAvailable({});
                assert.equal(Object.keys(res.result).length, 0, "There are Packs available when they shouldn't be");
            });

            it(`adds a pack type and has correct information for the pack type`, async () => {
                let testData1 = {
                    packType: "5",
                    numberOfNFTs: "3"
                }
                let testData2 = {
                    packType: "5",
                }

                await DappLib.addPackType(testData1);

                let res = await DappLib.getPackTypeInfo(testData2);

                assert.equal(res.result.numberOfNFTs, 3, "Pack type not created correctly");
                assert.equal(res.result.packType, 5, "Pack type not created correctly")
            });

            it(`fails when trying to mint a pack type that doesn't exist yet`, async () => {
                let testData = {
                    packType: "4",
                    numberOfPacks: "6"
                }

                try {
                    await DappLib.mintPacks(testData);
                } catch (e) {

                }
            })

            it(`mints packs and updated a pack type correctly`, async () => {
                let testData1 = {
                    packType: "5",
                    numberOfPacks: "6"
                }
                let testData2 = {
                    packType: "5",
                }
                await DappLib.mintPacks(testData1);

                let res = await DappLib.getPackTypeInfo(testData2);

                assert.equal(res.result.numberOfNFTs, 3, "Pack type not created correctly");
                assert.equal(res.result.packType, 5, "Pack type not created correctly")

            })

            it(`has the correct pack type after minting a pack`, async () => {
                let testData = {
                    id: 0,
                    acct: config.accounts[0]
                }

                let res = await DappLib.getPackInfo(testData);

                assert.equal(res.result.packType, 5, "Pack doesn't have correct packType")

            })

            it(`has correct number of packs in collection`, async () => {
                let testData = {
                    account: config.accounts[0]
                }
                let res = await DappLib.getOwnedPacks(testData);
                assert.equal(res.result.length, 6, "Did not mint packs correctly")
            })

            it(`has no packs up for sale`, async () => {
                let res = await DappLib.getPacksAvailable({});
                assert.equal(Object.keys(res.result).length, 0, "There should be no packs available")
            })

            it(`lists packs for sale and has 2 packs up for sale`, async () => {
                let testData1 = {
                    price: "30.0"
                }
                await DappLib.listPacksForSale(testData1);

                let res = await DappLib.getPacksAvailable({});
                assert.equal(Object.keys(res.result).length, 2, "There should be no packs available")

            })

            it(`transfers the pack and has correct number of packs in the accounts`, async () => {
                let testData1 = {
                    giver: config.accounts[0],
                    id: 4,
                    recipient: config.accounts[1]
                }
                let testData2 = {
                    account: config.accounts[0]
                }
                let testData3 = {
                    account: config.accounts[1]
                }
                await DappLib.transferPack(testData1);

                let res1 = await DappLib.getOwnedPacks(testData2)
                let res2 = await DappLib.getOwnedPacks(testData3)
                assert.equal(res1.result.length, 5, "Did not transfer pack correctly")
                assert.equal(res2.result.length, 1, "Did not transfer the pack correctly")
            })

            it(`opens the pack and has correct number of nfts and packs in collection`, async () => {
                let testData1 = {
                    id: 4,
                    recipient: config.accounts[1]
                }
                let testData2 = {
                    account: config.accounts[1]
                }

                await DappLib.openPack(testData1)

                let res1 = await DappLib.getNFTsInCollection(testData2)
                let res2 = await DappLib.getOwnedPacks(testData2)
                assert.equal(res1.result.length, 3, "Incorrect number of NFTs in collection")
                assert.equal(res2.result.length, 0, "Incorrect number of packs in collection")
            })

            it(`opens a pack that has already been opened and fails`, async () => {
                let testData = {
                    id: 4,
                    recipient: config.accounts[1]
                }

                try {
                    await DappLib.openPack(testData)
                } catch (e) {

                }
            })

            it(`has the correct properties for the newly minted NFTs`, async () => {
                let testData1 = {
                    account: config.accounts[1],
                    id: 0
                }
                let testData2 = {
                    account: config.accounts[1],
                    id: 1
                }
                let testData3 = {
                    account: config.accounts[1],
                    id: 2
                }

                let res1 = await DappLib.getNFTInfo(testData1)
                let res2 = await DappLib.getNFTInfo(testData2)
                let res3 = await DappLib.getNFTInfo(testData3)
                assert.equal(res1.result.id, 0, "Newly minted NFT does not have the correct properties.")
                assert.equal(res2.result.id, 1, "Newly minted NFT does not have the correct properties.")
                assert.equal(res3.result.id, 2, "Newly minted NFT does not have the correct properties.")
            })

            it(`transfers nft and has correct number of nfts in the accounts`, async () => {
                let testData1 = {
                    giver: config.accounts[1],
                    id: 0,
                    recipient: config.accounts[0]
                }
                let testData2 = {
                    account: config.accounts[1]
                }
                let testData3 = {
                    account: config.accounts[0]
                }

                await DappLib.transferNFT(testData1)

                let res1 = await DappLib.getNFTsInCollection(testData2)
                let res2 = await DappLib.getNFTsInCollection(testData3)
                assert.equal(res1.result.length, 2, "Did not transfer nft correctly")
                assert.equal(res2.result.length, 1, "Did not transfer nft correctly")

            })

            // makes sure no pack is transferred and no money is spent when buyPack fails
            it(`safely fails when trying to buy a pack with non-existent id`, async () => {
                let testData1 = {
                    recipient: config.accounts[1],
                    id: 10
                }
                let testData2 = {
                    account: config.accounts[0]
                }
                let testData3 = {
                    account: config.accounts[1]
                }

                try {
                    await DappLib.buyPack(testData1)
                } catch (e) {
                    let res1 = await DappLib.getOwnedPacks(testData2)
                    let res2 = await DappLib.getOwnedPacks(testData3)
                    let res3 = await DappLib.getFlowBalance(testData3)
                    assert.equal(res1.result.length, 5, "Transferred a pack when it wasn't supposed to.")
                    assert.equal(res2.result.length, 0, "Transferred a pack when it wasn't supposed to.")
                    assert.equal(res3.result, 1030.001, "Money was spent when it wasn't supposed to.")
                }
            })

            it(`buys a pack and has correct number of packs in the accounts`, async () => {
                let testData1 = {
                    recipient: config.accounts[1],
                    id: 5
                }
                let testData2 = {
                    account: config.accounts[0]
                }
                let testData3 = {
                    account: config.accounts[1]
                }

                await DappLib.buyPack(testData1)

                let res1 = await DappLib.getOwnedPacks(testData2)
                let res2 = await DappLib.getOwnedPacks(testData3)
                assert.equal(res1.result.length, 4, "Did not buy the pack correctly")
                assert.equal(res2.result.length, 1, "Did not buy the pack correctly")
            })

            it(`has correct pack type after buying a pack`, async () => {
                let testData = {
                    id: 5,
                    acct: config.accounts[1]
                }

                let res = await DappLib.getPackInfo(testData)

                assert.equal(res.result.packType, 5, "Pack has incorrect properties after buying it")
            })

            it(`has correct balance`, async () => {
                let testData1 = {
                    account: config.accounts[0]
                }
                let testData2 = {
                    account: config.accounts[1]
                }

                let res1 = await DappLib.getFlowBalance(testData1)
                let res2 = await DappLib.getFlowBalance(testData2)

                assert.equal(res1.result, 1060.001, "Did not mint tokens correctly")
                assert.equal(res2.result, 1000.001, "Did not mint tokens correctly")
            })

        });
        
    */
});