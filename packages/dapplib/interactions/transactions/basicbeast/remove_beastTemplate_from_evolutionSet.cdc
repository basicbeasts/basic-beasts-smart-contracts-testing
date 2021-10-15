import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction(setID: UInt32, beastTemplateID: UInt32) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.removeBeastTemplate(beastTemplateID: beastTemplateID)
    }

    post {
        BasicBeast.getBeastTemplatesInSet(setID: setID)!.contains(beastTemplateID) == false:
            "BeastTemplate is not removed"
    }
}