import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction(setID: UInt32, beastTemplateID: UInt32, matron: UInt64, sire: UInt64, evolvedFrom: [UInt64], recipientAddr: Address) {
    let adminRef: &BasicBeast.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)!
    }

    execute {
        let setRef = self.adminRef.borrowEvolutionSet(setID: setID)

        let beastTemplateToMint = BasicBeast.getBeastTemplate(beastTemplateID: beastTemplateID)!

        if beastTemplateToMint == nil {
            panic("BeastTemplate does not exist")
        }

        let newMintedBeast <- setRef.mintBeast(
                                                beastTemplate: beastTemplateToMint, 
                                                matron: matron, 
                                                sire: sire, 
                                                evolvedFrom: evolvedFrom
        )

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(BasicBeast.CollectionPublicPath).borrow<&{BasicBeast.BeastCollectionPublic}>()
            ?? panic("Can't borrow a reference to the Recipient's Beast collection")

        receiverRef.deposit(token: <-newMintedBeast)
    }
}