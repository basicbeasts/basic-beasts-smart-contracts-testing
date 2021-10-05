import Hero from "../../../contracts/Project/Hero.cdc"

transaction(lineage: {String: Bool}, heroStructID: UInt32) {

  let adminRef: &Hero.Admin

  prepare(acct: AuthAccount) {
    
    self.adminRef = acct.borrow<&Hero.Admin>(from: Hero.AdminStoragePath) 
            ?? panic("Could not borrow a reference to the Admin resource")
  
  }
  execute {
    self.adminRef.addLineageKeyValuePair(lineage: lineage, heroStructID: heroStructID)
  }

}
