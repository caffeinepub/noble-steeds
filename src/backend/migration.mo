import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  // Old types
  type OldHorse = {
    id : Text;
    name : Text;
    profilePhoto : ?Storage.ExternalBlob;
  };

  type OldInjury = {
    id : Text;
    horseId : Text;
    description : Text;
    timestamp : Int;
  };

  type OldFeedingEvent = {
    id : Text;
    horseId : Text;
    feedType : Text;
    amount : Int;
    timestamp : Int;
  };

  type OldMedicineDosage = {
    id : Text;
    horseId : Text;
    medicine : Text;
    dosage : Int;
    unit : Text;
    timestamp : Int;
  };

  type OldActor = {
    horses : Map.Map<Text, OldHorse>;
    injuries : Map.Map<Text, List.List<OldInjury>>;
    feedingEvents : Map.Map<Text, List.List<OldFeedingEvent>>;
    medicineDosages : Map.Map<Text, List.List<OldMedicineDosage>>;
  };

  // New types
  type NewHorse = {
    id : Nat;
    name : Text;
    profilePhoto : ?Storage.ExternalBlob;
  };

  type NewInjury = {
    id : Nat;
    horseId : Nat;
    description : Text;
    timestamp : Int;
  };

  type NewFeedingEvent = {
    id : Nat;
    horseId : Nat;
    feedType : Text;
    amount : Int;
    timestamp : Int;
  };

  type NewMedicineDosage = {
    id : Nat;
    horseId : Nat;
    medicine : Text;
    dosage : Int;
    unit : Text;
    timestamp : Int;
  };

  type CareActivity = {
    id : Nat;
    horseId : Nat;
    careType : Text;
    timestamp : Int;
    userId : Principal;
  };

  type NewActor = {
    horses : Map.Map<Nat, NewHorse>;
    injuries : Map.Map<Nat, List.List<NewInjury>>;
    feedingEvents : Map.Map<Nat, List.List<NewFeedingEvent>>;
    medicineDosages : Map.Map<Nat, List.List<NewMedicineDosage>>;
    careActivities : Map.Map<Nat, CareActivity>;
    horseIdCounter : Nat;
    injuryIdCounter : Nat;
    feedingEventIdCounter : Nat;
    medicineDosageIdCounter : Nat;
    careActivityIdCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newHorses = old.horses.map<Text, OldHorse, NewHorse>(
      func(_id, horse) { { id = 0; name = horse.name; profilePhoto = horse.profilePhoto } }
    );
    let newInjuries = old.injuries.map<Text, List.List<OldInjury>, List.List<NewInjury>>(
      func(_id, injuries) { List.empty<NewInjury>() }
    );
    let newFeedingEvents = old.feedingEvents.map<Text, List.List<OldFeedingEvent>, List.List<NewFeedingEvent>>(
      func(_id, events) { List.empty<NewFeedingEvent>() }
    );
    let newMedicineDosages = old.medicineDosages.map<Text, List.List<OldMedicineDosage>, List.List<NewMedicineDosage>>(
      func(_id, dosages) { List.empty<NewMedicineDosage>() }
    );

    {
      horses = Map.empty<Nat, NewHorse>();
      injuries = Map.empty<Nat, List.List<NewInjury>>();
      feedingEvents = Map.empty<Nat, List.List<NewFeedingEvent>>();
      medicineDosages = Map.empty<Nat, List.List<NewMedicineDosage>>();
      careActivities = Map.empty<Nat, CareActivity>();
      horseIdCounter = 0;
      injuryIdCounter = 0;
      feedingEventIdCounter = 0;
      medicineDosageIdCounter = 0;
      careActivityIdCounter = 0;
    };
  };
};
