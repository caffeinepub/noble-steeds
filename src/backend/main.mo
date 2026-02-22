import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Migration "migration";
import Int "mo:core/Int";

(with migration = Migration.run)
actor {
  // File Storage Integration
  include MixinStorage();

  // Horse Management Types
  type Horse = {
    id : Nat;
    name : Text;
    profilePhoto : ?Storage.ExternalBlob;
  };

  module Horse {
    public func compare(horse1 : Horse, horse2 : Horse) : Order.Order {
      Text.compare(horse1.name, horse2.name);
    };
  };

  // Injury Log Types
  type Injury = {
    id : Nat;
    horseId : Nat;
    description : Text;
    timestamp : Int;
  };

  // Feed Tracker Types
  type FeedingEvent = {
    id : Nat;
    horseId : Nat;
    feedType : Text;
    amount : Int;
    timestamp : Int;
  };

  // Medicine Dosage Types
  type MedicineDosage = {
    id : Nat;
    horseId : Nat;
    medicine : Text;
    dosage : Int;
    unit : Text;
    timestamp : Int;
  };

  // Care Activity Types
  type CareActivity = {
    id : Nat;
    horseId : Nat;
    careType : Text;
    timestamp : Int;
    userId : Principal;
  };

  // Persistent Storage
  let horses = Map.empty<Nat, Horse>();
  let injuries = Map.empty<Nat, List.List<Injury>>();
  let feedingEvents = Map.empty<Nat, List.List<FeedingEvent>>();
  let medicineDosages = Map.empty<Nat, List.List<MedicineDosage>>();
  let careActivities = Map.empty<Nat, CareActivity>();

  // Auto-incrementing ID counters
  var horseIdCounter = 0;
  var injuryIdCounter = 0;
  var feedingEventIdCounter = 0;
  var medicineDosageIdCounter = 0;
  var careActivityIdCounter = 0;

  // Horse Management
  public shared ({ caller }) func addHorse(name : Text, profilePhoto : ?Storage.ExternalBlob) : async Nat {
    let horseId = horseIdCounter;
    horseIdCounter += 1;

    let horse : Horse = {
      id = horseId;
      name;
      profilePhoto;
    };
    horses.add(horseId, horse);
    horseId;
  };

  public shared ({ caller }) func deleteHorse(id : Nat) : async () {
    switch (horses.get(id)) {
      case (null) { Runtime.trap("Horse does not exist") };
      case (?_) {
        horses.remove(id);

        // Remove associated injuries, feeding events, and medicine dosages
        injuries.remove(id);
        feedingEvents.remove(id);
        medicineDosages.remove(id);

        // Remove associated care activities
        let activitiesToRemove = careActivities.filter(
          func(_id, activity) {
            activity.horseId == id;
          }
        );
        activitiesToRemove.keys().forEach(func(activityId) { careActivities.remove(activityId) });
      };
    };
  };

  public query ({ caller }) func getHorse(id : Nat) : async Horse {
    switch (horses.get(id)) {
      case (null) { Runtime.trap("Horse does not exist") };
      case (?horse) { horse };
    };
  };

  public query ({ caller }) func getAllHorses() : async [Horse] {
    horses.values().toArray().sort();
  };

  // Injury Logs
  public shared ({ caller }) func logInjury(horseId : Nat, description : Text) : async Nat {
    switch (horses.get(horseId)) {
      case (null) { Runtime.trap("Horse does not exist") };
      case (?_) {
        let injuryId = injuryIdCounter;
        injuryIdCounter += 1;

        let newInjury : Injury = {
          id = injuryId;
          horseId;
          description;
          timestamp = Time.now();
        };

        switch (injuries.get(horseId)) {
          case (null) {
            let newList = List.singleton<Injury>(newInjury);
            injuries.add(horseId, newList);
          };
          case (?injuryList) {
            injuryList.add(newInjury);
          };
        };
        injuryId;
      };
    };
  };

  public query ({ caller }) func getHorseInjuries(horseId : Nat) : async [Injury] {
    switch (injuries.get(horseId)) {
      case (null) { [] };
      case (?injuryList) { injuryList.toArray() };
    };
  };

  // Feeding Tracker
  public shared ({ caller }) func logFeedingEvent(horseId : Nat, feedType : Text, amount : Int) : async Nat {
    switch (horses.get(horseId)) {
      case (null) { Runtime.trap("Horse does not exist") };
      case (?_) {
        let eventId = feedingEventIdCounter;
        feedingEventIdCounter += 1;

        let newEvent : FeedingEvent = {
          id = eventId;
          horseId;
          feedType;
          amount;
          timestamp = Time.now();
        };

        switch (feedingEvents.get(horseId)) {
          case (null) {
            let newList = List.singleton<FeedingEvent>(newEvent);
            feedingEvents.add(horseId, newList);
          };
          case (?eventList) {
            eventList.add(newEvent);
          };
        };
        eventId;
      };
    };
  };

  public query ({ caller }) func getHorseFeedingEvents(horseId : Nat) : async [FeedingEvent] {
    switch (feedingEvents.get(horseId)) {
      case (null) { [] };
      case (?eventList) { eventList.toArray() };
    };
  };

  // Medicine Dosage Tracking
  public shared ({ caller }) func recordMedicineDosage(
    horseId : Nat,
    medicine : Text,
    dosage : Int,
    unit : Text,
  ) : async Nat {
    switch (horses.get(horseId)) {
      case (null) { Runtime.trap("Horse does not exist") };
      case (?_) {
        let dosageId = medicineDosageIdCounter;
        medicineDosageIdCounter += 1;

        let newDosage : MedicineDosage = {
          id = dosageId;
          horseId;
          medicine;
          dosage;
          unit;
          timestamp = Time.now();
        };

        switch (medicineDosages.get(horseId)) {
          case (null) {
            let newList = List.singleton<MedicineDosage>(newDosage);
            medicineDosages.add(horseId, newList);
          };
          case (?dosageList) {
            dosageList.add(newDosage);
          };
        };
        dosageId;
      };
    };
  };

  public query ({ caller }) func getHorseMedicineDosages(horseId : Nat) : async [MedicineDosage] {
    switch (medicineDosages.get(horseId)) {
      case (null) { [] };
      case (?dosageList) { dosageList.toArray() };
    };
  };

  // Care Activities
  func compareByTimestampDescending(a : CareActivity, b : CareActivity) : Order.Order {
    Int.compare(b.timestamp, a.timestamp);
  };

  public shared ({ caller }) func logCareActivity(
    horseId : Nat,
    careType : Text,
  ) : async CareActivity {
    switch (horses.get(horseId)) {
      case (null) { Runtime.trap("Horse does not exist") };
      case (?_) {
        let careActivity : CareActivity = {
          id = careActivityIdCounter;
          horseId;
          careType;
          timestamp = Time.now();
          userId = caller;
        };

        careActivities.add(careActivityIdCounter, careActivity);
        careActivityIdCounter += 1;
        careActivity;
      };
    };
  };

  public query ({ caller }) func getCareActivitiesForHorse(horseId : Nat) : async [CareActivity] {
    let filteredActivities = careActivities.filter(
      func(_id, activity) {
        activity.horseId == horseId;
      }
    );

    filteredActivities.values().toArray().sort(
      compareByTimestampDescending
    );
  };
};
