import CharacterX from "../../../contracts/Project/CharacterX.cdc"

transaction(lineageKey: String, lineageValue: Bool) {
    let adminRef: &CharacterX.Admin
    let lineage: {String: Bool}
    
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("Couldn't borrow a reference to the Admin resource")
    }

    execute {
        self.adminRef.CharacterY.addLineageKeyVaulePair(lineageKey: lineageKey, lineageValue: lineageValue)
    }
/*
    post {
        CharacterX.getSetName(setID: self.currentSetID) == setName:
            "Couldn't find the specified set"
    }*/
}