import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction(setID: UInt32, beastTemplateID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath) 
            ?? panic("Could not borrow a reference to the Admin resource")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.addBeastTemplate(beastTemplateID: beastTemplateID)
    }

    post {
        BasicBeast.getBeastTemplatesInSet(setID: setID)!.contains(beastTemplateID):
            "Set does not contain beastTemplateID"
    }
}