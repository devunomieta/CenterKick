export interface League {
  name: string;
  country: string;
  flag: string;
  clubs: string[];
}

export const FOOTBALL_DATA: { leagues: League[] } = {
  leagues: [
    {
      name: "English Premier League",
      country: "England",
      flag: "GB",
      clubs: [
        "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion",
        "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
        "Leicester City", "Liverpool", "Manchester City", "Manchester United",
        "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur",
        "West Ham United", "Wolverhampton Wanderers"
      ]
    },
    {
      name: "Spanish La Liga",
      country: "Spain",
      flag: "ES",
      clubs: [
        "Alavés", "Athletic Bilbao", "Atlético Madrid", "Barcelona", "Celta Vigo",
        "Espanyol", "Getafe", "Girona", "Las Palmas", "Leganés",
        "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid",
        "Real Sociedad", "Sevilla", "Valencia", "Valladolid", "Villarreal"
      ]
    },
    {
      name: "German Bundesliga",
      country: "Germany",
      flag: "DE",
      clubs: [
        "Augsburg", "Bayer Leverkusen", "Bayern Munich", "Bochum", "Borussia Dortmund",
        "Borussia Mönchengladbach", "Eintracht Frankfurt", "Freiburg", "Heidenheim",
        "Hoffenheim", "Holstein Kiel", "Mainz 05", "RB Leipzig", "St. Pauli",
        "Stuttgart", "Union Berlin", "Werder Bremen", "Wolfsburg"
      ]
    },
    {
      name: "Italian Serie A",
      country: "Italy",
      flag: "IT",
      clubs: [
        "Atalanta", "Bologna", "Cagliari", "Como", "Empoli",
        "Fiorentina", "Genoa", "Inter Milan", "Juventus", "Lazio",
        "Lecce", "Monza", "Napoli", "Parma", "Roma",
        "Torino", "Udinese", "Venezia", "Verona"
      ]
    },
    {
      name: "French Ligue 1",
      country: "France",
      flag: "FR",
      clubs: [
        "Angers", "Auxerre", "Brest", "Le Havre", "Lille",
        "Lyon", "Marseille", "Monaco", "Montpellier", "Nantes",
        "Nice", "PSG", "Reims", "Rennes", "Saint-Étienne",
        "Strasbourg", "Toulouse"
      ]
    },
    {
      name: "Nigerian Premier League",
      country: "Nigeria",
      flag: "NG",
      clubs: [
        "Abia Warriors", "Akwa United", "Bayelsa United", "Bendel Insurance", "Doma United",
        "Enyimba", "Gombe United", "Heartland", "Kano Pillars", "Kwara United",
        "Lobi Stars", "Niger Tornadoes", "Plateau United", "Remo Stars", "Rivers United",
        "Shooting Stars", "Sporting Lagos", "Sunshine Stars"
      ]
    },
    {
      name: "Saudi Pro League",
      country: "Saudi Arabia",
      flag: "SA",
      clubs: [
        "Al-Ahli", "Al-Ettifaq", "Al-Fateh", "Al-Fayha", "Al-Hilal",
        "Al-Ittihad", "Al-Khaleej", "Al-Nassr", "Al-Okhdood", "Al-Raed",
        "Al-Riyadh", "Al-Shabab", "Al-Taawoun", "Al-Tai", "Al-Wehda",
        "Damac"
      ]
    },
    {
      name: "MLS",
      country: "USA",
      flag: "US",
      clubs: [
        "Atlanta United", "Austin FC", "Charlotte FC", "Chicago Fire", "FC Cincinnati",
        "Colorado Rapids", "Columbus Crew", "FC Dallas", "D.C. United", "Houston Dynamo",
        "Inter Miami CF", "LA Galaxy", "Los Angeles FC", "Minnesota United", "CF Montréal",
        "Nashville SC", "New England Revolution", "New York City FC", "New York Red Bulls",
        "Orlando City SC", "Philadelphia Union", "Portland Timbers", "Real Salt Lake",
        "San Jose Earthquakes", "Seattle Sounders", "Sporting Kansas City", "St. Louis City SC",
        "Toronto FC", "Vancouver Whitecaps"
      ]
    },
    {
        name: "Portuguese Primeira Liga",
        country: "Portugal",
        flag: "PT",
        clubs: ["Benfica", "FC Porto", "Sporting CP", "Braga", "Vitória de Guimarães"]
    },
    {
        name: "Dutch Eredivisie",
        country: "Netherlands",
        flag: "NL",
        clubs: ["Ajax", "PSV Eindhoven", "Feyenoord", "AZ Alkmaar", "Twente"]
    },
    {
        name: "Brazilian Serie A",
        country: "Brazil",
        flag: "BR",
        clubs: ["Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Grêmio", "Fluminense", "Santos"]
    },
    {
        name: "Austrian Bundesliga",
        country: "Austria",
        flag: "AT",
        clubs: ["RB Salzburg", "Sturm Graz", "LASK", "Rapid Wien", "Austria Wien", "SV Seekirchen"]
    }
  ]
};
