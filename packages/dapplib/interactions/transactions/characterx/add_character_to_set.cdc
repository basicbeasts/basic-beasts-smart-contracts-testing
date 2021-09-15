//TODO: Do this for all transactions check flowscan how it is used and whether improvements have been made.

import CharacterX from Project.CharacterX

transaction(setID: UInt32, characterID: UInt32) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath) 
            ?? panic("Could not borrow a reference to the Admin resource")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.addCharacter(characterID: characterID)
    }

    post {
        CharacterX.getCharactersInSet(setID: setID)!.contains(characterID):
            "Set does not contain characterID"
    }
}