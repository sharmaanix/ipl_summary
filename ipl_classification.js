/*
This program reads and parses all lines from csv files countries2.csv into an array (countriesArray) of arrays; each nested array represents a country.
The initial file read is synchronous. The country records are kept in memory.
*/


//Acquiring file system 
var fs = require('fs');
//Acquiring csv-parse 
var parse = require('csv-parse');
 
// including wink-statistics
var summary = require('wink-statistics').streaming.summary;
var samari = summary();
var freqTable = require('wink-statistics').streaming.freqTable;
var ft_season = freqTable();
var ft_host_country = freqTable();
var ft_host_cities = freqTable();
var ft_match_won = freqTable();
var ft_toss_decision = freqTable();
var index = 0;


var inputFile='Match.csv';
var average;
var key_min=[];
var key_max=[];
var object;

function print_obj(obj)
{     
      object = obj;
      return console.log(obj);

}

function max_min(obj)
{

  var max_min_avg =summary();

  for (key in obj)
  {
    max_min_avg.compute(obj[key]);
  }

  var conclusion =max_min_avg.result();
  for(key in obj)
  {
    if(obj[key]==conclusion.min)
    {
      key_min=key;

    }
    if (obj[key]==conclusion.max)
    {
      key_max=key;
    }
    
  }
  average =  conclusion.mean;
  
}

var parser = parse({delimiter: ','}, function (err, data) 
{
    // when all countries are available,then process them
    // note: array element at index 0 contains the row of headers that we should skip
    data.forEach(function(line) 
    {
      // create country object out of parsed fields
      var label = { "Match_Id" : line[0]
                    , "Match_Date" : line[1]
                    , "Team_Name_Id" : line[2]
                    , "Opponent_Team_Id" : line[3]
                    , "Season_Id" : line[4]
                    , "Venue_Name" : line[5]
                    , "Toss_Winner_Id" : line[6]
                    , "Toss_Decision" : line[7]
                    , "IS_Superover" : line[8]
                    , "IS_Result" : line[9]
                    , "Is_DuckWorthLewis" : line[10]
                    , "Win_Type" : line[11]
                    , "Won_By" : line[12]
                    , "Match_Winner_Id" : line[13]
                    , "Man_Of_The_Match_Id" : line[14]
                    , "First_Umpire_Id" : line[15]
                    , "Second_Umpire_Id" : line[16]
                    , "City_Name" : line[17]
                    , "Host_Country" : line[18]
                  };

                 if(index > 0)
                 {
                  samari.compute(+(label.Season_Id));
                  ft_season.build(label.Season_Id);
                  ft_host_country.build(label.Host_Country);
                  ft_host_cities.build(label.City_Name);
                  ft_match_won.build(label.Win_Type);
                  ft_toss_decision.build(label.Toss_Decision);
                }
                index++;
    });   
});
 
// read the inputFile, feed the contents to the parser
fs.createReadStream(inputFile).pipe(parser).on('end',function()
{
  
  console.log('Reading data has been completed');
  console.log('lets see the summarization of the IPL data');
  


  console.log(`the total number of IPL seasons are ` );
  write_file.write(`the total number of IPL seasons are ` );
  var  season_summary = samari.value();
  console.log(season_summary.max);
  


  console.log(`the total match played in each season is : `);
  print_obj(ft_season.value());
  max_min(ft_season.value());
  console.log(`average matches played in these seasons are : ${average}`);
  console.log(`the minimum matches was played in season ${key_min} which is ${object[key_min]} matches. `);
  console.log(`the maximum matches was played in season ${key_max} which is ${object[key_max]} matches. `);
  

  console.log("the number of matches  played in the countries till now are as follows :");
  print_obj(ft_host_country.value());
  max_min(ft_host_country.value());
  console.log(`the minimum matches was played in  ${key_min} which is ${object[key_min]} matches. `);
  console.log(`the maximum matches was played in  ${key_max} which is ${object[key_max]} matches. `);


  console.log("the number of matches played in the cities  till now are as follows :");
  print_obj(ft_host_cities.value());
  max_min(ft_host_cities.value());
  console.log(`the minimum matches was played in  ${key_min} which is ${object[key_min]} matches. `);
  console.log(`the maximum matches was played in  ${key_max} which is ${object[key_max]} matches. `);
  



  console.log("the number of matches won according to win type:");
  print_obj(ft_match_won.value());
  
  console.log("the  total toss decision : ");
  print_obj(ft_toss_decision.value());
  


  


});

