const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');
const fkill = require('fkill');

describe('Flow Dapp Tests', async () => {
	let config = null;
	before('setup contract', async () => {
		// Setup tasks for tests
		config = DappLib.getConfig();
	});

	after(() => {
		fkill(':3570');
	});

	/************ Basic Beasts ************/
	describe('Basic Beasts Tests', async () => {
		it(`1. Set up account`, async () => {
			let testData0 = {
				signer: config.accounts[0],
			};

			let testData1 = {
				signer: config.accounts[1],
			};

			let testData2 = {
				signer: config.accounts[2],
			};

			let testData3 = {
				signer: config.accounts[3],
			};

			let testData4 = {
				signer: config.accounts[4],
			};

			await DappLib.basicBeastSetupAccount(testData0);
			await DappLib.basicBeastSetupAccount(testData1);
			await DappLib.basicBeastSetupAccount(testData2);
			await DappLib.basicBeastSetupAccount(testData3);
			await DappLib.basicBeastSetupAccount(testData4);
		});

		it(`2. Create EvolutionSet - Admin`, async () => {
			let testData1 = {
				signer: config.accounts[0],
				setName: 'Stark',
				setID: '1',
			};

			let testData2 = {
				signer: config.accounts[0],
				setName: 'Targaryen',
				setID: '2',
			};

			let testData3 = {
				signer: config.accounts[0],
				setName: 'Lannister',
				setID: '3',
			};

			let testData4 = {
				signer: config.accounts[0],
				setName: 'Greyjoy',
				setID: '4',
			};

			await DappLib.basicBeastCreateEvolutionSet(testData1);
			await DappLib.basicBeastCreateEvolutionSet(testData2);
			await DappLib.basicBeastCreateEvolutionSet(testData3);
			await DappLib.basicBeastCreateEvolutionSet(testData4);

			let res1 = await DappLib.basicBeastGetEvolutionSetName(testData1);
			assert.equal(
				res1.result,
				'Stark',
				'Incorrect. Set name should be Stark'
			);

			let res2 = await DappLib.basicBeastGetEvolutionSetName(testData2);
			assert.equal(
				res2.result,
				'Targaryen',
				'Incorrect. Set name should be Targaryen'
			);

			let res3 = await DappLib.basicBeastGetEvolutionSetName(testData3);
			assert.equal(
				res3.result,
				'Lannister',
				'Incorrect. Set name should be Lannister'
			);

			let res4 = await DappLib.basicBeastGetEvolutionSetName(testData4);
			assert.equal(
				res4.result,
				'Greyjoy',
				'Incorrect. Set name should be Greyjoy'
			);
		});

		it(`3. Cannot create a Non Admin EvolutionSet`, async () => {
			let testData1 = {
				signer: config.accounts[1],
				setName: 'Non admin EvolutionSet',
			};

			try {
				await DappLib.basicBeastCreateEvolutionSet(testData1);
			} catch (e) {
				let res = await DappLib.basicBeastGetNextEvolutionSetID({});
				// next EvolutionSetID should be 5 since there are created 4 in total and setID starts with 1
				assert.equal(
					res.result,
					5,
					'❗Incorrect. Non Admin account should not be able to create an EvolutionSet'
				);
			}
		});

		it(`4. Create beastTemplates - Admin`, async () => {
			let testData1 = {
				signer: config.accounts[0],
				dexNumber: '1',
				name: 'Moon',
				image: 'URL',
				description: 'Basic beast',
				rarity: 'Secret Rare',
				skin: 'Normal',
				starLevel: '1',
				asexual: 'false',
				ultimateSkill: 'Fart',
				basicSkills: ['Eat', 'Sleep'],
				elements: { Fire: 'true' },
				data: { Data: 'Data..' },
				beastTemplateID: 1,
			};

			let testData2 = {
				signer: config.accounts[0],
				dexNumber: '2',
				name: 'Sir Moon',
				image: 'URL',
				description: 'Fine beast',
				rarity: 'Secret Rare',
				skin: 'Normal',
				starLevel: '2',
				asexual: 'false',
				ultimateSkill: 'Do Math',
				basicSkills: ['Eat', 'Sleep'],
				elements: { Fire: 'true' },
				data: { Data: 'Data..' },
				beastTemplateID: 2,
			};

			let testData3 = {
				signer: config.accounts[0],
				dexNumber: '3',
				name: 'CEO Moon',
				image: 'URL',
				description: 'Perfect beast',
				rarity: 'Secret Rare',
				skin: 'Shiny Gold',
				starLevel: '3',
				asexual: 'false',
				ultimateSkill: 'Dance to BTS',
				basicSkills: ['Eat', 'Sleep'],
				elements: { Fire: 'true' },
				data: { Data: 'Data..' },
				beastTemplateID: 3,
			};

			await DappLib.basicBeastCreateBeastTemplate(testData1);
			await DappLib.basicBeastCreateBeastTemplate(testData2);
			await DappLib.basicBeastCreateBeastTemplate(testData3);

			let res1 = await DappLib.basicBeastGetBeastTemplate(testData1);
			assert.equal(
				res1.result.dexNumber,
				'1',
				"❗Incorrect. The beast's dexNumber should be 1"
			);
			assert.equal(
				res1.result.name,
				'Moon',
				"❗Incorrect. The beast's name should be Moon"
			);
			assert.equal(
				res1.result.image,
				'URL',
				"❗Incorrect. The beast's image should be URL"
			);
			assert.equal(
				res1.result.description,
				'Basic Beast',
				"❗Incorrect. The beast's description should be Basic Beast"
			);
			assert.equal(
				res1.result.rarity,
				'Secret Rare',
				"❗Incorrect. The beast's rarity should be Secret Rare"
			);
			assert.equal(
				res1.result.skin,
				'Normal',
				"❗Incorrect. The beast's skin should be Normal"
			);

			/*
			let resDes =
				await DappLib.characterxCharactersGetCharacterDescription({
					characterID,
				});
			let resImage = await DappLib.characterxCharactersGetCharacterImage({
				characterID,
			});
			let resCreatedFrom1 =
				await DappLib.characterxCharactersGetCharacterCreatedFrom1({
					characterID,
				});
			let resCreatedFrom2 =
				await DappLib.characterxCharactersGetCharacterCreatedFrom2({
					characterID,
				});
			let resSex = await DappLib.characterxCharactersGetCharacterSex({
				characterID,
			});
			let resRace = await DappLib.characterxCharactersGetCharacterRace({
				characterID,
			});
			let resRarity =
				await DappLib.characterxCharactersGetCharacterRarity({
					characterID,
				});
			let resLineage =
				await DappLib.characterxCharactersGetCharacterLineage({
					characterID,
				});
			let resBloodline =
				await DappLib.characterxCharactersGetCharacterBloodline({
					characterID,
				});
			let resElement =
				await DappLib.characterxCharactersGetCharacterElement({
					characterID,
				});
			let resTraits =
				await DappLib.characterxCharactersGetCharacterTraits({
					characterID,
				});
			let resData = await DappLib.characterxCharactersGetCharacterData({
				characterID,
			});

			assert.equal(
				resName.result,
				'Willi Blue',
				"❗Incorrect. The character's name should be: Willi Blue"
			);
			assert.equal(
				resDes.result,
				'Character with the coolest name ever',
				"❗Incorrect. The character's description should be: Character with the coolest name ever"
			);
			assert.equal(
				resImage.result,
				'URL',
				"❗Incorrect. The character's image should be: URL"
			);
			assert.equal(
				resCreatedFrom1.result,
				0,
				"❗Incorrect. The character's createdFrom_1 should be: 0"
			);
			assert.equal(
				resCreatedFrom2.result,
				0,
				"❗Incorrect. The character's createdFrom_2 should be: 0"
			);
			assert.equal(
				resSex.result,
				'Male',
				"❗Incorrect. The character's sex should be: Male"
			);
			assert.equal(
				resRace.result,
				'Yellow',
				"❗Incorrect. The character's race should be: Yellow"
			);
			assert.equal(
				resRarity.result,
				'Fancy Intense',
				'❗Incorrect. The character rarity should be: Fancy Intense'
			);
			assert.equal(
				Object.keys(resLineage.result)[0],
				'Targaryen',
				"❗Incorrect. The character's lineage's key should be: Targaryen"
			);
			assert.equal(
				resLineage.result[Object.keys(resLineage.result)[0]],
				true,
				"❗Incorrect. The character's lineage's value should be: true"
			);
			assert.equal(
				Object.keys(resBloodline.result)[0],
				'O',
				"❗Incorrect. The character's bloodline's key should be: O"
			);
			assert.equal(
				resBloodline.result[Object.keys(resBloodline.result)[0]],
				false,
				"❗Incorrect. The character's bloodline's value should be: false"
			);
			assert.equal(
				Object.keys(resElement.result)[0],
				'Fire',
				"❗Incorrect. The character's element's key should be: Fire"
			);
			assert.equal(
				resElement.result[Object.keys(resElement.result)[0]],
				true,
				"❗Incorrect. The character's element's value should be: true"
			);
			assert.equal(
				Object.keys(resTraits.result)[0],
				'Traits',
				"❗Incorrect. The character's traits's key should be: Traits"
			);
			assert.equal(
				resTraits.result[Object.keys(resTraits.result)[0]],
				'Traits..',
				"❗Incorrect. The character's traits's value should be: Traits.."
			);
			assert.equal(
				Object.keys(resTraits.result)[1],
				'Traits 2',
				"❗Incorrect. The character's traits's key should be: Traits 2"
			);
			assert.equal(
				resTraits.result[Object.keys(resTraits.result)[1]],
				'Traits.. 2',
				"❗Incorrect. The character's traits's value should be: Traits.. 2"
			);
			assert.equal(
				Object.keys(resData.result)[0],
				'Data',
				"❗Incorrect. The character's data's key should be: Data"
			);
			assert.equal(
				resData.result[Object.keys(resData.result)[0]],
				'Data..',
				"❗Incorrect. The character's data's value should be: Data.."
			);*/
		});
		/*
                 // As Admin has created a character with characterID = 0. Next characterID should be 1
                 it(`6. Has correct next character ID`, async() => {
                     let res1 = await DappLib.characterxCharactersGetNextCharacterID({})
                     assert.equal(res1.result, 1, "❗Incorrect. The next character ID should be 1")
                     console.log("Next characterID should be 1: " + res1.result)


                 });

                 it(`7. Create a character (Non Admin)`, async() => {
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

                 it(`8. Create a second character (Admin)`, async() => {
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
                         lineage: { "Targaryen": "true", "Stark": "false" },
                         bloodline: { "O": "false" },
                         element: { "Fire": "true" },
                         traits: { "Traits": "Traits..", "Traits 2": "Traits.. 2" },
                         data: { "Data": "Data.." }
                     }

                     await DappLib.characterxCreateCharacter(testData1)

                     let characterID = "1"
                     let resName = await DappLib.characterxCharactersGetCharacterName({ characterID })
                     let resDes = await DappLib.characterxCharactersGetCharacterDescription({ characterID })
                     let resImage = await DappLib.characterxCharactersGetCharacterImage({ characterID })
                     let resCreatedFrom1 = await DappLib.characterxCharactersGetCharacterCreatedFrom1({ characterID })
                     let resCreatedFrom2 = await DappLib.characterxCharactersGetCharacterCreatedFrom2({ characterID })
                     let resSex = await DappLib.characterxCharactersGetCharacterSex({ characterID })
                     let resRace = await DappLib.characterxCharactersGetCharacterRace({ characterID })
                     let resRarity = await DappLib.characterxCharactersGetCharacterRarity({ characterID })
                     let resLineage = await DappLib.characterxCharactersGetCharacterLineage({ characterID })
                     let resBloodline = await DappLib.characterxCharactersGetCharacterBloodline({ characterID })
                     let resElement = await DappLib.characterxCharactersGetCharacterElement({ characterID })
                     let resTraits = await DappLib.characterxCharactersGetCharacterTraits({ characterID })
                     let resData = await DappLib.characterxCharactersGetCharacterData({ characterID })

                     assert.equal(resName.result, "Willi Blue", "❗Incorrect. The character's name should be: Willi Blue")
                     assert.equal(resDes.result, "Character with the coolest name ever", "❗Incorrect. The character's description should be: Character with the coolest name ever")
                     assert.equal(resImage.result, "URL", "❗Incorrect. The character's image should be: URL")
                     assert.equal(resCreatedFrom1.result, 0, "❗Incorrect. The character's createdFrom_1 should be: 0")
                     assert.equal(resCreatedFrom2.result, 0, "❗Incorrect. The character's createdFrom_2 should be: 0")
                     assert.equal(resSex.result, "Male", "❗Incorrect. The character's sex should be: Male")
                     assert.equal(resRace.result, "Yellow", "❗Incorrect. The character's race should be: Yellow")
                     assert.equal(resRarity.result, "Fancy Intense", "❗Incorrect. The character rarity should be: Fancy Intense")
                     assert.equal(Object.keys(resLineage.result)[0], "Targaryen", "❗Incorrect. The character's lineage's key should be: Targaryen")
                     assert.equal(resLineage.result[Object.keys(resLineage.result)[0]], true, "❗Incorrect. The character's lineage's value should be: true")
                     assert.equal(Object.keys(resLineage.result)[1], "Stark", "❗Incorrect. The character's lineage's key should be: Stark")
                     assert.equal(resLineage.result[Object.keys(resLineage.result)[1]], false, "❗Incorrect. The character's lineage's value should be: false")
                     assert.equal(Object.keys(resBloodline.result)[0], "O", "❗Incorrect. The character's bloodline's key should be: O")
                     assert.equal(resBloodline.result[Object.keys(resBloodline.result)[0]], false, "❗Incorrect. The character's bloodline's value should be: false")
                     assert.equal(Object.keys(resElement.result)[0], "Fire", "❗Incorrect. The character's element's key should be: Fire")
                     assert.equal(resElement.result[Object.keys(resElement.result)[0]], true, "❗Incorrect. The character's element's value should be: true")
                     assert.equal(Object.keys(resTraits.result)[0], "Traits", "❗Incorrect. The character's traits's key should be: Traits")
                     assert.equal(resTraits.result[Object.keys(resTraits.result)[0]], "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
                     assert.equal(Object.keys(resTraits.result)[1], "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
                     assert.equal(resTraits.result[Object.keys(resTraits.result)[1]], "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
                     assert.equal(Object.keys(resData.result)[0], "Data", "❗Incorrect. The character's data's key should be: Data")
                     assert.equal(resData.result[Object.keys(resData.result)[0]], "Data..", "❗Incorrect. The character's data's value should be: Data..")
                 });

                 // As Admin has created 2 characters. Next characterID should be 2
                 it(`9. Has correct next character ID`, async() => {
                     let res1 = await DappLib.characterxCharactersGetNextCharacterID({})
                     assert.equal(res1.result, 2, "❗Incorrect. The next character ID should be 1")
                     console.log("Next character ID should be 2: " + res1.result)

                 });

                 it(`10. Get characterID 1's multiple traits`, async() => {
                     let characterID = 1
                     let res1 = await DappLib.characterxCharactersGetCharacterTraits({ characterID })
                     assert.equal(Object.keys(res1.result)[0], "Traits", "❗Incorrect. The character's traits's key should be: Traits")
                     assert.equal(res1.result[Object.keys(res1.result)[0]], "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
                     assert.equal(Object.keys(res1.result)[1], "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
                     assert.equal(res1.result[Object.keys(res1.result)[1]], "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
                     console.log("Character " + characterID + "'s traits is: " + JSON.stringify(res1.result))
                 });

                 it(`11. Get characterID 0's data`, async() => {
                     let characterID = 0
                     let res1 = await DappLib.characterxCharactersGetCharacterData({ characterID })
                     assert.equal(Object.keys(res1.result)[0], "Data", "❗Incorrect. The character's data's key should be: Data")
                     assert.equal(res1.result[Object.keys(res1.result)[0]], "Data..", "❗Incorrect. The character's data's value should be: Data..")
                     console.log("Character's " + characterID + "'s data is " + JSON.stringify(res1.result))

                 });

                 it(`12. Get characterID 0's data field (value)`, async() => {
                     let testData1 = {
                         characterID: "0",
                         field: "Data"
                     }
                     let res1 = await DappLib.characterxCharactersGetCharacterDataField(testData1)
                     assert.equal(res1.result, "Data..", "❗Incorrect. The character's data's value should be: Data..")
                     console.log("Character's " + characterID + "'s data is " + JSON.stringify(res1.result))

                 });

                 it(`13. Get characterID 0's traits field (value)`, async() => {

                     let testData1 = {
                         characterID: "0",
                         field: "Traits"
                     }
                     let res1 = await DappLib.characterxCharactersGetCharacterTraitsField(testData1)
                     assert.equal(res1.result, "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
                     console.log("Character's " + characterID + "'s traits field is " + JSON.stringify(res1.result))

                 });

                 it(`14. Get characters in setID 0 - before adding any`, async() => {
                     let setID = 0
                     let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
                     assert.deepEqual(res1.result, [], "❗Incorrect. setID 0 should be empty - no characters")
                     console.log("Before adding any. Character(s) in " + setID + ": " + JSON.stringify(res1.result))

                 });

                 it(`15. Can not add characterID 0 to setID 0 - Non Admin`, async() => {

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

                 it(`16. Add characterID 0 to setID 0 - Admin`, async() => {

                     let testData1 = {
                         signer: config.accounts[0],
                         setID: "0",
                         characterID: "0"
                     }

                     await DappLib.characterxAddCharacterToSet(testData1)
                     let res1 = await DappLib.characterxSetsGetCharactersInSet(testData1)
                     assert.deepEqual(res1.result, [0], "❗Incorrect. setID 0 should contain characterID 0")

                 });
         */
		/*
                it(`17. Get characters in setID 0`, async() => {
                    let setID = 0
                    let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
                    assert.deepEqual(res1.result, [0], "❗Incorrect. setID 0 should only contain characterID 0")
                    console.log("Character(s) in " + setID + ": " + JSON.stringify(res1.result))

                });

                it(`18. Create a third character (Admin)`, async() => {
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
                        lineage: { "Targaryen": "true" },
                        bloodline: { "O": "false" },
                        element: { "Fire": "true" },
                        traits: { "Traits": "Traits..", "Traits 2": "Traits.. 2" },
                        data: { "Data": "Data.." }
                    }


                    await DappLib.characterxCreateCharacter(testData1)

                    let characterID = "3"
                    let resName = await DappLib.characterxCharactersGetCharacterName({ characterID })
                    let resDes = await DappLib.characterxCharactersGetCharacterDescription({ characterID })
                    let resImage = await DappLib.characterxCharactersGetCharacterImage({ characterID })
                    let resCreatedFrom1 = await DappLib.characterxCharactersGetCharacterCreatedFrom1({ characterID })
                    let resCreatedFrom2 = await DappLib.characterxCharactersGetCharacterCreatedFrom2({ characterID })
                    let resSex = await DappLib.characterxCharactersGetCharacterSex({ characterID })
                    let resRace = await DappLib.characterxCharactersGetCharacterRace({ characterID })
                    let resRarity = await DappLib.characterxCharactersGetCharacterRarity({ characterID })
                    let resLineage = await DappLib.characterxCharactersGetCharacterLineage({ characterID })
                    let resBloodline = await DappLib.characterxCharactersGetCharacterBloodline({ characterID })
                    let resElement = await DappLib.characterxCharactersGetCharacterElement({ characterID })
                    let resTraits = await DappLib.characterxCharactersGetCharacterTraits({ characterID })
                    let resData = await DappLib.characterxCharactersGetCharacterData({ characterID })

                    assert.equal(resName.result, "Willi Blue the 3rd", "❗Incorrect. The character's name should be: Willi Blue")
                    assert.equal(resDes.result, "Character with the coolest name ever", "❗Incorrect. The character's description should be: Character with the coolest name ever")
                    assert.equal(resImage.result, "URL", "❗Incorrect. The character's image should be: URL")
                    assert.equal(resCreatedFrom1.result, 0, "❗Incorrect. The character's createdFrom_1 should be: 0")
                    assert.equal(resCreatedFrom2.result, 0, "❗Incorrect. The character's createdFrom_2 should be: 0")
                    assert.equal(resSex.result, "Male", "❗Incorrect. The character's sex should be: Male")
                    assert.equal(resRace.result, "Yellow", "❗Incorrect. The character's race should be: Yellow")
                    assert.equal(resRarity.result, "Fancy Intense", "❗Incorrect. The character rarity should be: Fancy Intense")
                    assert.equal(Object.keys(resLineage.result)[0], "Targaryen", "❗Incorrect. The character's lineage's key should be: Targaryen")
                    assert.equal(resLineage.result[Object.keys(resLineage.result)[0]], true, "❗Incorrect. The character's lineage's value should be: true")
                    assert.equal(Object.keys(resBloodline.result)[0], "O", "❗Incorrect. The character's bloodline's key should be: O")
                    assert.equal(resBloodline.result[Object.keys(resBloodline.result)[0]], false, "❗Incorrect. The character's bloodline's value should be: false")
                    assert.equal(Object.keys(resElement.result)[0], "Fire", "❗Incorrect. The character's element's key should be: Fire")
                    assert.equal(resElement.result[Object.keys(resElement.result)[0]], true, "❗Incorrect. The character's element's value should be: true")
                    assert.equal(Object.keys(resTraits.result)[0], "Traits", "❗Incorrect. The character's traits's key should be: Traits")
                    assert.equal(resTraits.result[Object.keys(resTraits.result)[0]], "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
                    assert.equal(Object.keys(resTraits.result)[1], "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
                    assert.equal(resTraits.result[Object.keys(resTraits.result)[1]], "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
                    assert.equal(Object.keys(resData.result)[0], "Data", "❗Incorrect. The character's data's key should be: Data")
                    assert.equal(resData.result[Object.keys(resData.result)[0]], "Data..", "❗Incorrect. The character's data's value should be: Data..")


                });

                it(`19. Create a fourth character (Admin)`, async() => {
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
                        lineage: { "Targaryen": "true" },
                        bloodline: { "O": "false" },
                        element: { "Fire": "true" },
                        traits: { "Traits": "Traits..", "Traits 2": "Traits.. 2" },
                        data: { "Data": "Data.." }
                    }


                    await DappLib.characterxCreateCharacter(testData1)

                    let characterID = "3"
                    let resName = await DappLib.characterxCharactersGetCharacterName({ characterID })
                    let resDes = await DappLib.characterxCharactersGetCharacterDescription({ characterID })
                    let resImage = await DappLib.characterxCharactersGetCharacterImage({ characterID })
                    let resCreatedFrom1 = await DappLib.characterxCharactersGetCharacterCreatedFrom1({ characterID })
                    let resCreatedFrom2 = await DappLib.characterxCharactersGetCharacterCreatedFrom2({ characterID })
                    let resSex = await DappLib.characterxCharactersGetCharacterSex({ characterID })
                    let resRace = await DappLib.characterxCharactersGetCharacterRace({ characterID })
                    let resRarity = await DappLib.characterxCharactersGetCharacterRarity({ characterID })
                    let resLineage = await DappLib.characterxCharactersGetCharacterLineage({ characterID })
                    let resBloodline = await DappLib.characterxCharactersGetCharacterBloodline({ characterID })
                    let resElement = await DappLib.characterxCharactersGetCharacterElement({ characterID })
                    let resTraits = await DappLib.characterxCharactersGetCharacterTraits({ characterID })
                    let resData = await DappLib.characterxCharactersGetCharacterData({ characterID })

                    assert.equal(resName.result, "Willi Blue the 4th", "❗Incorrect. The character's name should be: Willi Blue")
                    assert.equal(resDes.result, "Character with the coolest name ever", "❗Incorrect. The character's description should be: Character with the coolest name ever")
                    assert.equal(resImage.result, "URL", "❗Incorrect. The character's image should be: URL")
                    assert.equal(resCreatedFrom1.result, 0, "❗Incorrect. The character's createdFrom_1 should be: 0")
                    assert.equal(resCreatedFrom2.result, 0, "❗Incorrect. The character's createdFrom_2 should be: 0")
                    assert.equal(resSex.result, "Male", "❗Incorrect. The character's sex should be: Male")
                    assert.equal(resRace.result, "Yellow", "❗Incorrect. The character's race should be: Yellow")
                    assert.equal(resRarity.result, "Fancy Intense", "❗Incorrect. The character rarity should be: Fancy Intense")
                    assert.equal(Object.keys(resLineage.result)[0], "Targaryen", "❗Incorrect. The character's lineage's key should be: Targaryen")
                    assert.equal(resLineage.result[Object.keys(resLineage.result)[0]], true, "❗Incorrect. The character's lineage's value should be: true")
                    assert.equal(Object.keys(resLineage.result)[1], "Stark", "❗Incorrect. The character's lineage's key should be: Stark")
                    assert.equal(resLineage.result[Object.keys(resLineage.result)[1]], false, "❗Incorrect. The character's lineage's value should be: false")
                    assert.equal(Object.keys(resBloodline.result)[0], "O", "❗Incorrect. The character's bloodline's key should be: O")
                    assert.equal(resBloodline.result[Object.keys(resBloodline.result)[0]], false, "❗Incorrect. The character's bloodline's value should be: false")
                    assert.equal(Object.keys(resElement.result)[0], "Fire", "❗Incorrect. The character's element's key should be: Fire")
                    assert.equal(resElement.result[Object.keys(resElement.result)[0]], true, "❗Incorrect. The character's element's value should be: true")
                    assert.equal(Object.keys(resTraits.result)[0], "Traits", "❗Incorrect. The character's traits's key should be: Traits")
                    assert.equal(resTraits.result[Object.keys(resTraits.result)[0]], "Traits..", "❗Incorrect. The character's traits's value should be: Traits..")
                    assert.equal(Object.keys(resTraits.result)[1], "Traits 2", "❗Incorrect. The character's traits's key should be: Traits 2")
                    assert.equal(resTraits.result[Object.keys(resTraits.result)[1]], "Traits.. 2", "❗Incorrect. The character's traits's value should be: Traits.. 2")
                    assert.equal(Object.keys(resData.result)[0], "Data", "❗Incorrect. The character's data's key should be: Data")
                    assert.equal(resData.result[Object.keys(resData.result)[0]], "Data..", "❗Incorrect. The character's data's value should be: Data..")

                });

                it(`20. Can not add characterID 1 and 2 to setID 0  - Non Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[1],
                        setID: "0",
                        characters: ["0", "1"]
                    }

                    try {
                        await DappLib.characterxAddCharactersToSet(testData1)
                    } catch (e) {
                        let res1 = await DappLib.characterxSetsGetCharactersInSet(testData1)
                        assert.deepEqual(res1.result, [0], "❗Incorrect. setID 0 should only contain characterID 0")
                    }
                });

                it(`21. Add characterID 1 and 2 to setID 0 - Admin`, async() => {

                    let testData1 = {
                        signer: config.accounts[0],
                        setID: "0",
                        characters: ["1", "2"]
                    }

                    await DappLib.characterxAddCharactersToSet(testData1)
                        // let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
                    let res1 = await DappLib.characterxSetsGetCharactersInSet(testData1)
                    assert.deepEqual(res1.result, [0, 1, 2], "❗Incorrect. setID 0 should contain characterID 0, 1, 2")

                });

                it(`22. Get characters in setID 0`, async() => {
                    let setID = 0
                    let res1 = await DappLib.characterxSetsGetCharactersInSet({ setID })
                    assert.deepEqual(res1.result, [0, 1, 2], "❗Incorrect. setID 0 should contain characterID 0, 1, 2")
                    console.log("Character(s) in " + setID + ": " + JSON.stringify(res1.result))

                });

                // Characters with character ID 2 and 3 has already been added to set ID 0
                it(`23. Can not add character ID 2 and 3 to set ID 0 - Admin`, async() => {
                    let testData1 = {
                        signer: config.accounts[0],
                        setID: "0",
                        characters: ["1", "2"]
                    }

                    try {
                        await DappLib.characterxAddCharactersToSet(testData1)
                    } catch (e) {
                        let res1 = await DappLib.characterxSetsGetCharactersInSet(testData1)
                        assert.deepEqual(res1.result, [0, 1, 2], "❗Incorrect. setID 0 should contain characterID 0, 1, 2")
                        console.log("Character ID 1 and 2 already exist in set ID 0")
                    }

                });*/
		/*
               it(`24. Get total supply - before minting charaters`, async() => {

                   let res1 = await DappLib.characterxGetTotalSupply({})
                   assert.equal(res1.result, 0, "❗Incorrect. Total supply should be 0")
                   console.log("Total supply is: " + res1.result)

               });

               it(`25. Can not mint characterID 0, setID 0 to accounts[2] - Non Admin`, async() => {

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


               it(`26. Mint characterID 0, setID 0 to Admin account - Admin`, async() => {

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
