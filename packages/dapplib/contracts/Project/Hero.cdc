/*
        Hero.cdc

        Description: Central Smart Contract for The Eighth Note Hero NFTs

        Authors: bz bz.vanity@gmail.com
                 williblue

        This smart contract contains the core functionality for 
        the Hero characters that are part of The Eighth Note universe.

        When a new Hero wants to be added to the records, an Admin creates
        a new HeroStruct that is stored in the smart contract.

        Then an Admin can create new Sets. Sets consist of a public struct that 
        contains public information about a set, and a private resource used 
        to mint new heroes based off of HeroStructs that have been linked to the Set

        The admin resource has the power to do all of the important actions
        in the smart contract and sets. When they want to call functions in a set,
        they call their borrowSet function to get a reference
        to a set in the contract.
        Then they can call functions on the set using that reference.

        In this way, the smart contract and its defined resources interact.

        When heroes are minted, they are initialized with a HeroData struct and 
        are returned by the minter.

        The contract also defines a Collection resource. This is an object that
        every Hero NFT owner will store in their account
        to manage their NFT Collection

        The main Hero account will also have its own hero collection that it can 
        use to hold its own heroes that have not yet been sent to a user.

        Note: All state changing functions will panic if an invalid argument is 
        provided or one of its pre-conditions or post-conditions aren't met.
        Functions that don't modify state will simply return 0 or nil
        and those cases need to be handled by the caller.

        Special thanks to: 
        Jacob, Morgan and the rest of the Decentology team for teaching us how to write cadence and build Dapps.
        Josh, Dieter and the rest of the Flow and Dapper Labs team for making TopShot and Flow Blockchain great and available to everyone.
        You are the best partners, teachers, mentors, and friends one could ever ask for.

*/

import NonFungibleToken from  "../Flow/NonFungibleToken.cdc"

pub contract Hero: NonFungibleToken {

    // -----------------------------------------------------------------------
    // Hero contract-level Events
    // -----------------------------------------------------------------------

    // Emitted when the contract is created
    pub event ContractInitialized()

    // Events for Set-related actions
    //
    // Emitted when a new Set is created
    pub event SetCreated(setID: UInt32, series: UInt32)
    // Emitted when a new HeroStruct is added to a Set
    pub event HeroStructAddedToSet(setID: UInt32, heroStructID: UInt32)
    // Emitted when a HeroStruct is retired from a Set and cannot be used to mint
    pub event HeroStructRetiredFromSet(setID: UInt32, heroStructID: UInt32, numHeroes: UInt32)
    // Emitted when a Set is locked, meaning HeroStructs cannot be added
    pub event SetLocked(setID: UInt32)
    // Emitted when a Hero is minted from a Set
    pub event HeroMinted(heroID: UInt64, heroStructID: UInt32, setID: UInt32, serialNumber: UInt32)

    // Events for Hero-related actions
    //
    // Emitted when a beneficiary has been set to a Hero
    pub event HeroBeneficiaryIsSet(id: UInt64, beneficiary: Address?)
    // Emitted when a Hero is destroyed
    pub event HeroDestroyed(id: UInt64)

    // Events for Admin-related actions
    //
    // Emitted when a new HeroStruct is created
    pub event HeroStructCreated(
                                id: UInt32, 
                                name: String, 
                                sex: String, 
                                race: String, 
                                rarity: String, 
                                createdAt: UInt64, 
                                createdFrom: [UInt64], 
                                linages: {String: Bool},
                                bloodlines: {String: Bool}, 
                                elements: {String: Bool},
                                traits: {String: String},
                                data: {String: String})
    
    // Emitted when a new series has been triggered by an admin
    pub event NewSeriesStarted(newCurrentSeries: UInt32)
    // Emitted when a new key-value-pair of HeroStruct's data has been added
    pub event NewHeroStructDataFieldAdded(heroStructID: UInt32, key: String, value: String)
    // Emitted when a key of a HeroStruct's data has been removed
    pub event HeroStructDataFieldRemoved(heroStructID: UInt32, key: String)

    // Events for Collection-related actions
    //
    // Emitted when a Hero is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)
    // Emitted when a Hero is deposited into a Collection
    pub event Deposit(id: UInt64, to: Address?)

    // -----------------------------------------------------------------------
    // Hero contract-level Named Paths
    // -----------------------------------------------------------------------
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    // -----------------------------------------------------------------------
    // Hero contract-level fields.
    // These contain actual values that are stored in the smart contract.
    // -----------------------------------------------------------------------

    // Series that a Set belongs to.
    // Series is a concept that indicates a group of Sets through time.
    // Many Sets can exist at a time, but only one series.
    pub var currentSeries: UInt32

    // Variable size dictionary of Hero structs
    access(self) var heroStructs: {UInt32: HeroStruct}

    // Variable size dictionary of Set resources
    access(self) var sets: @{UInt32: Set}

    // The ID that is used to create HeroStructs.
    // Every time a HeroStruct is created, heroStructID is assigned
    // to the new HeroStruct's ID and then is incremented by 1.
    pub var nextHeroStructID: UInt32

    // The ID that is used to create Sets. Every time a Set is created
    // setID is assigned to the new set's ID and then is incremented by 1.
    pub var nextSetID: UInt32

    // The total number of Hero NFTs that have been created
    // Because NFTs can be destroyed, it doesn't necessarily mean that this
    // reflects the total number of NFTs in existence, just the number that
    // have been minted to date. Also used as global hero IDs for minting.
    pub var totalSupply: UInt64

    // -----------------------------------------------------------------------
    // The Eighth Note Hero contract-level Composite Type definitions
    // -----------------------------------------------------------------------
    // These are just *definitions* for Types that this contract
    // and other accounts can use. These definitions do not contain
    // actual stored values, but an instance (or object) of one of these Types
    // can be created by this contract that contains stored values.
    // -----------------------------------------------------------------------

    // HeroStruct holds metadata associated with a specific Hero.
    //
    // Hero NFTs will all reference a single HeroStruct as the owner of
    // its metadata. The HeroStructs are publicly accessible, so anyone can
    // read the metadata associated with a specific HeroStruct ID
    //
    pub struct HeroStruct { 

        // The unique ID for the HeroStruct.
        pub let heroStructID: UInt32

        // The HeroStruct's name.
        pub let name: String

        // The HeroStruct's physical characteristics at birth.
        pub let sex: String
        
        // The HeroStruct's race.
        pub let race: String

        // The HeroStruct's rarity.
        pub let rarity: String

        // A unix timestamp with millisecond precision of when the HeroStruct was created.
        pub let createdAt: UInt64

        // An array of the Heroes this HeroStruct was created from.
        // A HeroStruct can be created from 1 or more Heroes.
        pub let createdFrom: [UInt64]

        // A dictionary of the HeroStruct's lineages.
        // e.g. is the HeroStruct from the genesis lineage?
        pub let lineages: {String: Bool}

        // A dictionary of the HeroStruct's bloodlines.
        // e.g. is the HeroStruct part of the Stark bloodline?
        pub let bloodlines: {String: Bool}

        // A dictionary of the HeroStruct's elements.
        // e.g. does the HeroStruct have fire or water as its elements?
        pub let elements: {String: Bool}

        // A dictionary of the HeroStruct's traits.
        // e.g. what eye color does the HeroStruct have?
        pub let traits: {String: String}

        // A string mapping of all other HeroStruct metadata
        pub var data: {String: String}

        init(
        name: String,
        sex: String,
        race: String,
        rarity: String, 
        createdAt: UInt64,
        createdFrom: [UInt64],
        lineages: {String: Bool},
        bloodlines: {String: Bool},
        elements: {String: Bool},
        traits: {String: String}, 
        data: {String: String},
        ) {
            pre {
                name != "": "New HeroStruct name cannot be blank"
                sex != "": "New HeroStruct must have sex"
                race != "": "New HeroStruct race cannot be blank"
                rarity != "": "New HeroStruct rarity must be determined"
                createdAt != nil: "New HeroStruct createdAt unix timestamp cannot be blank"
                createdFrom.length != 0: "New HeroStruct must be created from something"
                lineages.length != 0: "New HeroStruct lineages cannot be empty"
                bloodlines.length != 0: "New HeroStruct bloodlines cannot be empty"
                elements.length != 0: "New HeroStruct elements cannot be empty"
                traits.length != 0: "New HeroStruct traits cannot be empty"
                data.length != 0: "New HeroStruct data cannot be empty"
            }
            self.heroStructID = Hero.nextHeroStructID 
            self.name = name
            self.sex = sex
            self.race = race
            self.rarity = rarity
            self.createdAt = createdAt
            self.createdFrom = createdFrom
            self.lineages = lineages
            self.bloodlines = bloodlines
            self.elements = elements
            self.traits = traits
            self.data = data

            // Increment the ID so that it isn't used again
            Hero.nextHeroStructID = Hero.nextHeroStructID + 1 as UInt32

            emit HeroStructCreated(
                                    id: self.heroStructID, 
                                    name: self.name, 
                                    sex: self.sex, 
                                    race: self.race, 
                                    rarity: self.rarity, 
                                    createdAt: self.createdAt, 
                                    createdFrom: self.createdFrom, 
                                    linages: self.lineages,
                                    bloodlines: self.bloodlines, 
                                    elements: self.elements,
                                    traits: self.traits,
                                    data: self.data
                                    )
        }
    }

    // A Set is a grouping of HeroStructs. A HeroStruct can exist in multiple different sets.
    // 
    // SetData is a struct that is used so anyone can easily 
    // query information about a set by calling various getters located 
    // at the end of the contract. Only the admin has the ability 
    // to modify any data in the private Set resource.
    //
    pub struct SetData {

        // Unique ID for the Set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Series that this Set belongs to.
        // Series is a concept that indicates a group of Sets through time.
        // Many Sets can exist at a time, but only one series.
        pub let series: UInt32

        // Array of HeroStructs that are a part of this Set.
        // When a HeroStruct is added to the Set, its ID gets appended here.
        // The ID does not get removed from this array when a HeroStruct is retired.
        pub var heroStructsInSet: [UInt32]

        // Map of heroStructIDs that indicates if a HeroStruct in this Set can be minted.
        // When a HeroStruct is added to a Set, it is mapped to false (not retired).
        // When a HeroStruct is retired, this is set to true and cannot be changed.
        pub var retired: {UInt32: Bool}

        // Indicates if the Set is currently locked.
        // When a Set is created, it is unlocked 
        // and HeroStructs are allowed to be added to it.
        // When a set is locked, HeroStructs cannot be added.
        // A Set can never be changed from locked to unlocked,
        // the decision to lock a Set is final.
        // If a Set is locked, HeroStructs cannot be added, but
        // Heroes can still be minted from HeroStructs
        // that exist in the Set.
        pub var locked: Bool

        // Mapping of heroStructIDs that indicates the number of Heroes 
        // that have been minted for specific HeroStructs in this Set.
        // When a Hero is minted, this value is stored in the Hero to
        // show its place in the Set, eg. 13 of 60.
        pub var numOfMintedPerHeroStruct: {UInt32: UInt32}

        init(setID: UInt32) {
            pre {
                setID != nil: "setID cannot be empty"
            }

            let set = &Hero.sets[setID] as &Set

            self.setID = set.setID
            self.name = set.name
            self.series = set.series
            self.heroStructsInSet = set.heroStructsInSet
            self.retired = set.retired
            self.locked = set.locked
            self.numOfMintedPerHeroStruct = set.numOfMintedPerHeroStruct
        }
    }
    
    // Set is a resource type that contains the functions to add and remove
    // HeroStructs from a Set and mint Heroes.
    //
    // It is stored in a private field in the contract so that
    // the admin resource can call its methods.
    //
    // The admin can add HeroStructs to a Set so that the set can mint Heroes
    // that reference that HeroStruct.
    // The Heroes that are minted by a Set will be listed as belonging to
    // the Set that minted it, as well as the HeroStruct it references.
    // 
    // Admin can also retire HeroStructs from the Set, meaning that the retired
    // HeroStruct can no longer have Heroes minted from it.
    //
    // If the admin locks the Set, no more HeroStructs can be added to it, but 
    // Heroes can still be minted.
    //
    // If retireAll() and lock() are called back-to-back, 
    // the Set is closed off forever and nothing more can be done with it.
    pub resource Set {

        // Unique ID for the Set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Series that this Set belongs to.
        // Series is a concept that indicates a group of Sets through time.
        // Many Sets can exist at a time, but only one series.
        pub let series: UInt32

        // Array of HeroStructs that are a part of this Set.
        // When a HeroStruct is added to the Set, its ID gets appended here.
        // The ID does not get removed from this array when a HeroStruct is retired.
        access(contract) var heroStructsInSet: [UInt32]

        // Map of heroStructIDs that indicates if a HeroStruct in this Set can be minted.
        // When a HeroStruct is added to a Set, it is mapped to false (not retired).
        // When a HeroStruct is retired, this is set to true and cannot be changed.
        access(contract) var retired: {UInt32: Bool}

        // Indicates if the Set is currently locked.
        // When a Set is created, it is unlocked 
        // and HeroStructs are allowed to be added to it.
        // When a set is locked, HeroStructs cannot be added.
        // A Set can never be changed from locked to unlocked,
        // the decision to lock a Set is final.
        // If a Set is locked, HeroStructs cannot be added, but
        // Heroes can still be minted from HeroStructs
        // that exist in the Set.
        access(contract) var locked: Bool

        // Mapping of heroStructIDs that indicates the number of Heroes 
        // that have been minted for specific HeroStructs in this Set.
        // When a Hero is minted, this value is stored in the Hero to
        // show its place in the Set, eg. 13 of 60.
        access(contract) var numOfMintedPerHeroStruct: {UInt32: UInt32}

        init(name: String) {
            self.setID = Hero.nextSetID
            self.name = name
            self.series = Hero.currentSeries
            self.heroStructsInSet = []
            self.retired = {}
            self.locked = false
            self.numOfMintedPerHeroStruct = {}

            // Increment the ID so that it isn't used again
            Hero.nextSetID = Hero.nextSetID + 1 as UInt32

            emit SetCreated(setID: self.setID, series: self.series)
        }

        // addHeroStruct adds a HeroStruct to the Set
        //
        // Parameters: heroStructID: The ID of the HeroStruct that is being added
        //
        // Pre-Conditions:
        // The HeroStruct needs to be an existing HeroStruct
        // The Set must not be locked
        // The HeroStruct can't have already been added to the Set
        //
        pub fun addHeroStruct(heroStructID: UInt32) {
            pre {
                Hero.heroStructs[heroStructID] != nil: "Cannot add the HeroStruct to Set: The HeroStruct doesn't exist."
                !self.locked: "Cannot add the HeroStruct to the Set: The Set is locked."
                self.numOfMintedPerHeroStruct[heroStructID] == nil: "The HeroStruct has already been added to the Set." 
            }

            // Add the HeroStruct to the array of heroStructsInSet
            self.heroStructsInSet.append(heroStructID)

            // Open the HeroStruct up for minting
            self.retired[heroStructID] = false

            // Initialize the Hero minted count for this HeroStruct to zero
            self.numOfMintedPerHeroStruct[heroStructID] = 0

            emit HeroStructAddedToSet(setID: self.setID, heroStructID: heroStructID)
        }

        // addHeroStructs adds multiple HeroStructs to the Set
        //
        // Parameters: heroStructIDs: The IDs of the HeroStructs that are being added
        //                      as an array
        //
        pub fun addHeroStructs(heroStructIDs: [UInt32]) {
            for heroStruct in heroStructIDs {
                self.addHeroStruct(heroStructID: heroStruct)
            }
        }

        // retireHeroStruct retires a HeroStruct from the Set so that it can't mint new Heroes
        //
        // Parameters: heroStructID: The ID of the HeroStruct that is being retired
        //
        // Pre-Conditions:
        // The HeroStruct is part of the Set and not retired (available for minting).
        // 
        pub fun retireHeroStruct(heroStructID: UInt32) {
            pre {
                self.retired[heroStructID] != nil: "Cannot retire the HeroStruct: The HeroStruct doesn't exist in the Set."
            }

            if !self.retired[heroStructID]! {
                self.retired[heroStructID] = true

                 emit HeroStructRetiredFromSet(setID: self.setID, heroStructID: heroStructID, numHeroes: self.numOfMintedPerHeroStruct[heroStructID]!)
            }
        }

        // retireAll retires all the HeroStructs in the Set
        // Afterwards, none of the retired HeroStructs will be able to mint new Heroes
        //
        pub fun retireAllHeroStructs() {
            for heroStruct in self.heroStructsInSet { 
                self.retireHeroStruct(heroStructID: heroStruct) 
            }
        }

        // lock() locks the Set so that no more HeroStructs can be added to it
        //
        // Pre-Conditions:
        // The Set should not be locked
        pub fun lock() {
            if !self.locked {
                self.locked = true
                emit SetLocked(setID: self.setID)
            }
        }
        
        // mintHero mints a new Hero and returns the newly minted Hero
        // 
        // Parameters: heroStructID: The ID of the HeroStruct that the Hero references
        //
        // Pre-Conditions:
        // The Hero must exist in the Set and be allowed to mint new Heroes
        //
        // Returns: The NFT that was minted
        // 
        pub fun mintHero(heroStructID: UInt32): @NFT {
            pre {
                self.retired[heroStructID] != nil: "Cannot mint the Hero: This HeroStruct doesn't exist in this set."
                !self.retired[heroStructID]!: "Cannot mint the Hero from this HeroStruct: This HeroStruct has been retired in this set."
            }

            // Gets the number of Heroes that have been minted for this HeroStruct
            // to use as this HeroStructs's serial number
            let numInHeroStruct = self.numOfMintedPerHeroStruct[heroStructID]!

            // Mint the new Hero
            let newHero: @NFT <- create NFT(
                                            serialNumber: numInHeroStruct + 1 as UInt32, 
                                            heroStructID: heroStructID, 
                                            setID: self.setID,
                                            )

            // Increment the count of Heroes minted for this HeroStruct
            self.numOfMintedPerHeroStruct[heroStructID] = numInHeroStruct + 1 as UInt32

            return <-newHero
        }
        
        // batchMintHero mints a specified quantity of a 
        // single referenced HeroStruct and returns them as a Collection
        //
        // Parameters: heroStructID: the ID of the HeroStruct that the Heroes are minted for
        //             quantity: The quantity of the HeroStruct to be minted
        //
        // Returns: Collection object that contains all the Heroes that were minted
        // TODO: firstOwner beneficiary fix
        pub fun batchMintHero(
                                heroStructID: UInt32, 
                                quantity: UInt64): @Collection {
            let newCollection <- create Collection()

            var count: UInt64 = 0
            while count < quantity {
                newCollection.deposit(token: <-self.mintHero(heroStructID: heroStructID))
                count = count + 1 as UInt64
            }

            return <-newCollection
        }

    }

    // HeroData is a struct and contains the metadata of a Hero NFT
    pub struct HeroData {

        // The ID of the Set that the Hero comes from
        pub let setID: UInt32

        // The ID of the HeroStruct that the Hero references
        pub let heroStructID: UInt32

        // The place in the edition that this Hero was minted
        // Otherwise known as the serial number
        pub let serialNumber: UInt32

        init(setID: UInt32, heroStructID: UInt32, serialNumber: UInt32) {
            self.setID = setID
            self.heroStructID = heroStructID
            self.serialNumber = serialNumber
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        // Global unique hero ID
        pub let id: UInt64

        // The wallet address of the beneficiary to receive 
        // possible royalty fees from all future trades of this NFT
        pub var beneficiary: Address?

        // Struct of Hero NFT metadata
        pub let data: HeroData

        init(
            serialNumber: UInt32, 
            heroStructID: UInt32, 
            setID: UInt32, 
            ) {
            // Increment the global Hero IDs
            Hero.totalSupply = Hero.totalSupply + 1 as UInt64

            // Set unique hero ID to the newly incremented totalSupply
            self.id = Hero.totalSupply

            // Set beneficiary to nil
            self.beneficiary = nil

            // Set the metadata struct
            self.data = HeroData(setID: setID, heroStructID: heroStructID, serialNumber: serialNumber)

            emit HeroMinted(heroID: self.id, heroStructID: heroStructID, setID: self.data.setID, serialNumber: self.data.serialNumber)
        }

        pub fun setBeneficiary(beneficiary: Address) {
            pre {
                self.beneficiary == nil: "Beneficiary is already initialized"
            }

            self.beneficiary = beneficiary
            emit HeroBeneficiaryIsSet(id: self.id, beneficiary: self.beneficiary!)
        }

        pub fun getBeneficiary(): Address? {
            return self.beneficiary
        }

        // If the Hero is destroyed, emit an event to indicate 
        // to outside observers that is has been destroyed.
        destroy() {
            emit HeroDestroyed(id: self.id)
        }
    }

    // Admin is a special authorization resource that
    // allows the owner to perform important functions to modify the
    // various aspects of the HeroStructs, Sets, and Heroes
    //
    pub resource Admin {

        // createHeroStruct creates a new HeroStruct
        // and stores it in the HeroStructs dictionary in the The Eighth Note Hero smart contract
        // 
        // Parameters: 
        // name: The name of the HeroStruct
        // sex: The HeroStruct's physical characteristics at birth. "Female" or "Male"
        // race: The race of the HeroStruct. e.g. "Human" or "Beast"
        // rarity: The rarity of the HeroStruct. e.g. "Legendary" or "Mythic"
        // createdAt: The unix timestamp of when this HeroStruct was created
        // createdFrom: The array of HeroStruct IDs this HeroStruct was created from
        // lineages: A dictionary mapping of lineages to check which lineages the HeroStruct belongs to
        // bloodlines: A dictionary mapping of bloodlines to check which bloodlines the HeroStruct belongs to
        // elements: A dictionary mapping of elements to check which elements the HeroStruct has
        // traits: A dictionary mapping of traits of the HeroStruct's traits
        // data: A dictionary mapping of other types of metadata
        // 
        // Returns: the ID of the new HeroStruct object
        //
        pub fun createHeroStruct(
            name: String,
            sex: String,
            race: String,
            rarity: String, 
            createdAt: UInt64,
            createdFrom: [UInt64],
            lineages: {String: Bool},
            bloodlines: {String: Bool},
            elements: {String: Bool},
            traits: {String: String}, 
            data: {String: String}
            ): UInt32 {
            // Create the new HeroStruct
            var newHeroStruct = HeroStruct(
                name: name,
                sex: sex,
                race: race,
                rarity: rarity,
                createdAt: createdAt,
                createdFrom: createdFrom, 
                lineages: lineages,
                bloodlines: bloodlines,
                elements: elements,
                traits: traits, 
                data: data
            )

            let newID = newHeroStruct.heroStructID

            // Store it in the contract storage
            Hero.heroStructs[newID] = newHeroStruct

            return newID
        }

        // createSet creates a new Set resource and stores it
        // in the sets mapping in this contract
        // 
        // Parameters: name: The name of the Set
        //
        pub fun createSet(name: String) {
            var newSet <- create Set(name: name)

            Hero.sets[newSet.setID] <-! newSet
        }

        // borrowSet returns a reference to a set in the Hero
        // contract so that the admin can call methods on it
        //
        // Parameters: setID: The ID of the set that you want to
        // get a reference to
        //
        // Returns: A reference to the set with all of the fields
        // and methods exposed
        //
        pub fun borrowSet(setID: UInt32): &Set {
            pre {
                Hero.sets[setID] != nil: "Cannot borrow Set: The Set doesn't exist."
            }

            // use `&` to indicate the reference to the object and/(as) type. 
            return &Hero.sets[setID] as &Set
        }

        // startNewSeries ends the current series by incrementing
        // the series number, meaning that heroes will be using the 
        // new series number from now on
        //
        // Returns: The new series number
        //
        pub fun startNewSeries(): UInt32 {
            // end the current series and start a new one
            // by incrementing the series number
            Hero.currentSeries = Hero.currentSeries + 1 as UInt32

            emit NewSeriesStarted(newCurrentSeries: Hero.currentSeries)

            return Hero.currentSeries
        }

        // updateHeroStructDataByField updates a HeroStruct's data
        // by adding a new key value pair to the data dictionary
        //
        // Parameters: 
        // heroStructID: The id of the HeroStruct to update
        // key: The new key to insert into data
        // value: The value that is to be inserted with the key
        //
        // Returns: The data as a String to String mapping optional
        //
        pub fun updateHeroStructDataByField(heroStructID: UInt32, key: String, value: String): {String: String}? {
            pre {
                Hero.heroStructs[heroStructID] != nil: "Cannot update HeroStruct: The HeroStruct doesn't exist."
            }

            let old = Hero.heroStructs[heroStructID]?.data?.insert(key: key, value)

            emit NewHeroStructDataFieldAdded(heroStructID: heroStructID, key: key, value: value)

            return Hero.heroStructs[heroStructID]?.data
        }

        // removeHeroStructDataByField removes a key from 
        // a HeroStruct's data dictionary
        //
        // Parameters: 
        // heroStructID: The id of the HeroStruct to update
        // key: The key that is to be removed from the data dictionary
        //
        // Returns: The removed key as a String optional
        //
        pub fun removeHeroStructDataByField(heroStructID: UInt32, key: String): String??  {
            pre {
                Hero.heroStructs[heroStructID] != nil: "Cannot change HeroStruct data: The HeroStruct doesn't exist."
            }

            let removedKey = Hero.heroStructs[heroStructID]?.data?.remove(key: key)

            emit HeroStructDataFieldRemoved(heroStructID: heroStructID, key: key)

            return removedKey
        }

        // createNewAdmin creates a new Admin Resource
        //
        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }

    pub resource interface HeroCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowHero(id: UInt64): &Hero.NFT? { 
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrw Hero reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: HeroCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {

            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: The Hero does not exist in the Collection")

            emit Withdraw(id: token.id, from: self.owner?.address)
            
            return <-token
        }

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            // Create a new empty Collection
            var batchCollection <- create Collection()
            
            // Iterate through the ids and withdraw them from the Collection
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            
            // Return the withdrawn tokens
            return <-batchCollection
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Hero.NFT

            let id = token.id
            
            let oldToken <- self.ownedNFTs[id] <- token

            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }

            destroy oldToken
        }

        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {
            let keys = tokens.getIDs()

            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }

            destroy tokens
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowHero(id: UInt64): &Hero.NFT? {

            if self.ownedNFTs[id] != nil { 
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &Hero.NFT
            } else {
                return nil
            }

        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // -----------------------------------------------------------------------
    // Hero contract-level function definitions
    // -----------------------------------------------------------------------

    // createEmptyCollection creates a new, empty Collection object so that
    // a user can store it in their account storage.
    // Once they have a Collection in their storage, they are able to receive
    // Heroes in transactions
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create Hero.Collection()
    }

    // getAllHeroStructs returns all the HeroStructs in this Hero smart contract
    //
    // Returns: An array of all the HeroStructs that have been created
    pub fun getAllHeroStructs(): [Hero.HeroStruct] {
        return Hero.heroStructs.values
    }

    // getHeroStruct returns a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The HeroStruct as a Hero.HeroStruct optional
    pub fun getHeroStruct(heroStructID: UInt32): Hero.HeroStruct? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]
    }

    // getHeroStructName returns the name of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The name as a String optional
    pub fun getHeroStructName(heroStructID: UInt32): String? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.name
    }

    // getHeroStructSex returns the sex of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The sex as a String optional
    pub fun getHeroStructSex(heroStructID: UInt32): String? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.sex
    }

    // getHeroStructRace returns the race of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The race as a String optional
    pub fun getHeroStructRace(heroStructID: UInt32): String? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.race
    }

    // getHeroStructRarity returns the rarity of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The rarity as a String optional
    pub fun getHeroStructRarity(heroStructID: UInt32): String? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.rarity
    }

    // getHeroStructCreatedAt returns the unix timestamp of 
    // when a specific HeroStruct was created
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The unix timestamp as a UInt64 optional
    pub fun getHeroStructCreatedAt(heroStructID: UInt32): UInt64? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.createdAt
    }

    // getHeroStructCreatedFrom returns an array 
    // of the HeroStruct IDs that reference HeroStructs, 
    // a specific HeroStruct has been created from
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The HeroStruct IDs as a UInt32 array optional
    pub fun getHeroStructCreatedFrom(heroStructID: UInt32): [UInt64]? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.createdFrom
    }

    // getHeroStructLineages returns a mapping to check whether 
    // a specific HeroStruct belongs to a certain lineage
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The lineages as a String to Bool mapping optional
    pub fun getHeroStructLineages(heroStructID: UInt32): {String: Bool}? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.lineages
    }

    // getHeroStructLineagesByField returns a Bool associated with
    // a specific field of the lineages
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The lineage field as a Bool optional
    pub fun getHeroStructLineagesByField(heroStructID: UInt32, field: String): Bool? {
        // Don't force a revert if the heroStructID or field is invalid
        if let heroStruct = Hero.heroStructs[heroStructID] {
            return heroStruct.lineages[field]
        } else {
            return nil
        }
    } 
    
    // getHeroStructBloodlines returns a mapping to check whether 
    // a specific HeroStruct belongs to a certain bloodline
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The bloodlines as a String to Bool mapping optional
    pub fun getHeroStructBloodlines(heroStructID: UInt32): {String: Bool}? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.bloodlines
    }

    // getHeroStructBloodlinesByField returns a Bool associated with
    // a specific field of the bloodlines
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The bloodline field as a Bool optional
    pub fun getHeroStructBloodlinesByField(heroStructID: UInt32, field: String): Bool? {
        // Don't force a revert if the heroStructID or field is invalid
        if let heroStruct = Hero.heroStructs[heroStructID] {
            return heroStruct.bloodlines[field]
        } else {
            return nil
        }
    } 

    // getHeroStructElements returns a mapping to check whether 
    // a specific HeroStruct has certain elements
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The elements as a String to Bool mapping optional
    pub fun getHeroStructElements(heroStructID: UInt32): {String: Bool}? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.elements
    }

    // getHeroStructElementsByField returns a Bool associated with
    // a specific field of the elements
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The element field as a Bool optional
    pub fun getHeroStructElementsByField(heroStructID: UInt32, field: String): Bool? {
        // Don't force a revert if the heroStructID or field is invalid
        if let heroStruct = Hero.heroStructs[heroStructID] {
            return heroStruct.elements[field]
        } else {
            return nil
        }
    } 

    // getHeroStructTraits returns all the traits associated with a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The traits as a String to String mapping optional
    pub fun getHeroStructTraits(heroStructID: UInt32): {String: String}? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.traits
    }

    // getHeroStructTraitsByField returns the trait associated with a 
    // specific field of the traits
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The trait field as a String optional
    pub fun getHeroStructTraitsByField(heroStructID: UInt32, field: String): String? {
        // Don't force a revert if the heroStructID or field is invalid
        if let heroStruct = Hero.heroStructs[heroStructID] {
            return heroStruct.traits[field]
        } else {
            return nil
        }
    }     

    // getHeroStructData returns all the other data associated with a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The data as a String to String mapping optional
    pub fun getHeroStructData(heroStructID: UInt32): {String: String}? {
        // Don't force a revert if the heroStructID is invalid
        return self.heroStructs[heroStructID]?.data
    }

    // getHeroStructSex returns the sex of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The sex as a String optional
    pub fun getHeroStructDataByField(heroStructID: UInt32, field: String): String? {
        // Don't force a revert if the heroStructID or field is invalid
        if let heroStruct = Hero.heroStructs[heroStructID] {
            return heroStruct.data[field]
        } else {
            return nil
        }
    } 
    
    // getHeroStructSex returns the sex of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The sex as a String optional
    pub fun getSetName(setID: UInt32): String? {
        // Don't force a revert if the setID is invalid
        return Hero.sets[setID]?.name
    }

    // getHeroStructSex returns the sex of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The sex as a String optional
    pub fun getSetSeries(setID: UInt32): UInt32? {
        // Don't force a revert if the setID is invalid
        return Hero.sets[setID]?.series
    }

    // getHeroStructSex returns the sex of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The sex as a String optional
    pub fun getSetIDsByName(setName: String): [UInt32]? {
        var setIDs: [UInt32] = []

        for setID in self.sets.keys {
            if setName == Hero.SetData(setID: setID).name {
                setIDs.append(setID)
            }
        }

        if setIDs.length == 0 {
            return nil
        } else {
            return setIDs
        }
    }

    // getHeroStructSex returns the sex of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The sex as a String optional
    pub fun getHeroStructsInSet(setID: UInt32): [UInt32]? {
        // Don't force a revert if the setID is invalid
        return Hero.sets[setID]?.heroStructsInSet
    }

    // getHeroStructSex returns the sex of a specific HeroStruct
    // 
    // Parameters: heroStructID: The id of the HeroStruct that is being searched
    //
    // Returns: The sex as a String optional
    pub fun isEditionRetired(setID: UInt32, heroStructID: UInt32): Bool? {
        // Don't force a revert if the set or heroStruct ID is invalid
        // Remove the set from the dictionary to get its field
        if let setToRead <- Hero.sets.remove(key: setID) {

            // See if the HeroStruct is retired from this Set
            let retired = setToRead.retired[heroStructID]

            // Put the Set back in the contract storage
            Hero.sets[setID] <-! setToRead

            // Return the retired status
            return retired
        } else {

            // If the Set wasn't found, return nil
            return nil
        }
    }


    pub fun isSetLocked(setID: UInt32): Bool? {
        // Don't force a revert if the setID is invalid
        return Hero.sets[setID]?.locked
    }


    pub fun getNumHeroesInEdition(setID: UInt32, heroStructID: UInt32): UInt32? {

        if let setToRead <- Hero.sets.remove(key: setID) {

            // Read the numOfMintedPerHeroStruct
            let amount = setToRead.numOfMintedPerHeroStruct[heroStructID]

            // Put the Set back into the Sets dictionary
            Hero.sets[setID] <-! setToRead

            return amount
        } else {
            // If the set wasn't found return nil
            return nil
        }
    }

    init() {
        self.CollectionStoragePath = /storage/theEighthNoteHeroCollection
        self.CollectionPublicPath = /public/theEighthNoteHeroCollection
        self.AdminStoragePath = /storage/theEighthNoteHeroAdmin

        self.currentSeries = 0
        self.heroStructs = {}
        self.sets <- {}
        self.nextHeroStructID = 0
        self.nextSetID = 0
        self.totalSupply = 0

        // Put a new Collection in storage
        self.account.save<@Collection>(<- create Collection(), to: self.CollectionStoragePath)

        // Create a public capability for the Collection
        self.account.link<&{HeroCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)

        // Put the Minter in storage
        self.account.save<@Admin>(<- create Admin(), to: self.AdminStoragePath)

        emit ContractInitialized()
    }

}