require('dotenv').config()
const mongoose = require('mongoose')

// 5.Define a mongoose schema that accepts the following entity
const { Schema } = mongoose;
const Film = new Schema ({
    filmtype : String,
    filmProducerName : String,
    endDate: Date,
    filmName : String,
    district : String,
    geolocation : 
    {
        coordinates : [Number],
        type : { type :String},
    },
    sourceLocationId : String,
    filmDirectorName : String,
    address : String,
    startDate : Date,
    year : Number,
})
//6. Connect to the database, using credentials stored in the .env file and the dotenv package
mongoose.connect(process.env.MONGO_URI).then(() => {console.log('Connected !')})

//7.Write a function that takes an array of FilmingLocations (file lieux-de-tournage-a-paris.json from workshop 1) and imports each FilmingLocation in Mongo
// and 8.Call the function with data from lieux-de-tournage-a-paris.json, populate the database
const Location = mongoose.model("Location",Film)
const filmingLocations = require('./lieux-de-tournage-a-paris.json')

function buildLocation(filmingLocation)
{
    return new Location({
        filmType: filmingLocation.fields.type_tournage,
        filmProducerName: filmingLocation.fields.nom_producteur,
        endDate: filmingLocation.fields.date_fin,
        filmName: filmingLocation.fields.nom_tournage,
        district: filmingLocation.fields.ardt_lieu,
        sourceLocationId: filmingLocation.fields.id_lieu,
        filmDirectorName: filmingLocation.fields.nom_realisateur,
        address: filmingLocation.fields.adresse_lieu,
        startDate: filmingLocation.fields.date_debut,
        year: filmingLocation.fields.annee_tournage,
        geolocation: filmingLocation.fields.geo_shape
    })
}

async function importBulkFilmingLocations()
{
  const locations = []
  for(const filmingLocation of filmingLocations){
    locations.push(buildLocation(filmingLocation))
  }
  await Location.insertMany(locations)
}

//9.Write a function to query one Location by its ID
async function findOneByID(id)
{
  try 
  {
    return Location.findOne({_id:id});
  }
  catch(error)
  {
    console.log("unknown location")
    console.log(error);
  }
}

//10.Write a function to query all Locations for a given filmName
async function findAll(filmName)
{
  try 
  {
    return Location.find({filmName});
  }
  catch(error)
  {
    console.log("unknown location")
    console.log(error);
  }
}

//11.Write a function to delete a Location by its ID
async function deleteByID(id)
{
  try 
  {
    Location.findOneAndDelete( {_id:id});
    console.log('Suppression effectuée avec succès!');
  }
  catch(error)
  {
    console.log("unknown location")
    console.log(error);
  }
}

//12.Write a function to add a Location
function addLocation(location)
{
  try 
  {
    location.save();
    console.log('Ajout effectué avec succès!');
  }
  catch(error)
  {
    console.log("unknown location")
    console.log(error);
  }
}

//13.Write a function to update a Location
function updateLocation(id, update)
{
  try 
  {
    Location.updateOne({ _id: id }, update);
    console.log('MAJ effectuée avec succès!')
  }
  catch(error)
  {
    console.log("unknown location")
    console.log(error);
  }
}

async function main()
{
  await importBulkFilmingLocations()
  console.log('Import terminé avec succès !')

  const l1 = await findOneByID('638780c67dd43669cfbbe90c')
  console.log(l1)

  const l2 = await findAll("TOUT S'EST BIEN PASSE")
  console.log(l2)

  const newLocation = new Location({filmType : "LONG METRAGE",
        filmProducerName : "Quentin Tarantino",
        endDate: new Date("01-01-2001"),
        filmName: "Pulp Fiction",
        district: "75015",
        geolocation: [90.00000,90.00000],
        sourceLocationId : "123456",
        filmDirectorName: "Quentin Tarantino",
        address: "12 bis rue de la Paix",
        startDate: new Date("10-01-1990"),
        year: parseInt("2001")})
  await addLocation(newLocation);

  const miseAJour = {$set: {filmName: 'Star Wars VI'}};
  await updateLocation('638780c67dd43669cfbbe90c', miseAJour);

  const l3 = await findOneByID('638780c67dd43669cfbbe90c')
  console.log(l3)

  const l4 = await findAll('Star Wars VI')
  console.log(l4)

  await deleteByID('638780c67dd43669cfbbe90c')

  const l5 = await findOneByID('638780c67dd43669cfbbe90c')
  console.log(l5)

}

main();

// Notes de cours :
/*
async function main()
{
    
    const result = await mongoose.connect(param1)
    console.log(result)
    const result2 = await mongoose.connect(param2)
    console.log(result2)
    const connections = await Promise.all([mongoose.connect(1),mongoose.connect(2),mongoose.connect(3)])
    console.log(connections)
    
   
}
*/

//const Location = new mongoose.Model('Location', locationSchema)
//const maPremiereLocation = new Location({filmType: 'Horror'})
//await maPremiereLocation.save()

console.log("It works")