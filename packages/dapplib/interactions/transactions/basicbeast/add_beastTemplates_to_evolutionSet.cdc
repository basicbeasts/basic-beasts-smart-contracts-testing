import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction(setID: UInt32, beastTemplateIDs: [UInt32]) {

    let adminRef: &BasicBeast.Admin
    
    prepare(acct: AuthAccount) {

        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)!

    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        setRef.addBeastTemplates(beastTemplateIDs: beastTemplateIDs)
    }
}