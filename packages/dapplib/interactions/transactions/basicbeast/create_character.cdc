import CharacterX from "../../../contracts/Project/CharacterX.cdc"

transaction(
            name: String, //might be removed
            description: String, //might be removed
            image: String, //might be removed
            createdFrom_1: UInt64,
            createdFrom_2: UInt64,
            sex: String,
            race: String,
            rarity: String, 
            lineage: {String: Bool},
            bloodline: {String: Bool},
            element: {String: Bool},
            traits: {String: String}, 
            data: {String: String}
            ) {
    let adminRef: &CharacterX.Admin
    let currentCharacterID: UInt32

    prepare(acct: AuthAccount) {
        self.currentCharacterID = CharacterX.nextCharacterID;
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No admin resource in storage")
    }
    execute {
        self.adminRef.createCharacter(name: name, description: description, image: image, createdFrom_1: createdFrom_1, createdFrom_2: createdFrom_2, sex: sex, race: race, rarity: rarity, lineage: lineage, bloodline: bloodline, element: element, traits: traits, data: data)
    }

    post {
        CharacterX.getCharacterData(characterID: self.currentCharacterID) != nil:
            "characterID doesn't exist"
    }
            }