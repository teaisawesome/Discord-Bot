module.exports = {
    name: 'questedit',
    description: 'Log a quest to backend',
    execute(message, args)
    {
        let qTypes = ['Combat', 'Life', 'Trade'];
        let qSizes = ['S', 'M', 'L', 'XL'];

        let quest = {
            id: args[0],
            loguser: `<@${message.member.id}>`,
            type: args[1],
            size: args[2],
            reward: args[3],
            contribution: message.mentions.users.map(function(item){return `<@${item.id}>`})
        };
        
        if(args.length < 4){
            throw 'Argumentumok száma nem megfelelő'
            return -1
		}
		if(!qTypes.includes(quest.type)){
			throw 'A quest típusa csak a következők lehetnek : Combat,Life,Trade'
			return -1
		}
		if(!qSizes.includes(quest.size)){
			throw 'A quest mérete csak a következők lehetnek : S,M,L,XL'
			return -1
		}
		if(isNaN(quest.reward) || quest.reward > 100 || quest.reward <= 0){
			throw 'A quest jutalmat egy 0 és 100 közötti számként kell megadni'
			return -1
		}
		if(quest.contribution.length < 1){
			throw 'Valakit mindenképp megkell jelölni a küldetés logolásához, ha egyedül csináltad, akkor jelöld meg magadat!'
			return -1
        }

        // nézzük, hogy valid-e az ID, amit módosítani akarunk
        if(isValidQuestId(quest.id))
        {
            // módosítjuk a quest-et
            editQuest(quest.id, quest);   
            message.channel.send(`A ${quest.id} azonosítójú quest módosítva lett! Módosította: ${quest.loguser} Dátum: ${timestampToDate(message.createdTimestamp)}`);
            message.channel.send(`A módosított quest a következő adatokkal rögzítésre került: ID: ${quest.id} Típus: ${quest.type}, Méret: ${quest.size}, Jutalom(millióban): ${quest.reward},Résztvevők: ${quest.contribution} Rögzítette: ${quest.loguser} Dátum: ${timestampToDate(getQuestDate(quest.id))}`);
        }
        else
        {
            throw 'Nincs ilyen azonosítóval rendelkező quest.'
            return -1
        }
    }
};

/**
 * Eljárás a questek módosítására.
 * 
 * A paraméterben megadott ID alapján megkeresi módosítani kívánt quest objektumot
 * és módosítja az értékeit.
 */

function editQuest(id, editedquest)
{
    const fs = require('fs');
    const logfile = 'quest-data.json';

    fs.readFile(logfile, 'utf8', function readFileCallback(err, data){
		if (err){
			if(err.code == 'ENOENT'){
				obj = {
					array: []
				};
				obj.array.push(quest);
				json = JSON.stringify(obj);
				fs.writeFileSync(logfile, json);
			}
			else{
				console.log(err);
			}
		}
		else {
            obj = JSON.parse(data);
            
            let index = 0;

            /*
                Végigiterál a JSON objektum-tömbön és a megadott indexű objektumot keresi.
                Ha megtalálta akkor módosítja az értékeit.
            */
            obj.array.forEach(element => {

                if(element.id == id)
                {
                    element.type = editedquest.type;
                    element.size = editedquest.size;
                    element.reward = editedquest.reward;
                    element.contribution = editedquest.contribution;
                }   

                index++;             
            });

            json = JSON.stringify(obj);
			fs.writeFileSync(logfile, json);
		}
	});
}

/**
 * Függvény annak vizsgálatára, hogy már létezik-e a paraméterben
 * megadott id, amivel törölni szeretnénk.
 * 
 * Az fs, logfile mellett vár egy id paramétert, amely alapján fog validálni.
 *
 * return true - ha van találtat
 * return false - ha nincs találat
 */
function isValidQuestId(id)
{
    const fs = require('fs');
    const logfile = 'quest-data.json';

    var data = fs.readFileSync(logfile);

    obj = JSON.parse(data);

    var result = false;

    var index = 0;

    obj.array.forEach(element => {
        if(element.id == id)
        {
            result = true;
        }
        index++;
    });

    return result;

}
/**
 * Segédfüggvény a módosított quest dátumának kiírására.
 */
function getQuestDate(id)
{
    const fs = require('fs');
    const logfile = 'quest-data.json';

    var data = fs.readFileSync(logfile);

    obj = JSON.parse(data);

    var date = 0;

    var index = 0;

    obj.array.forEach(element => {
        if(element.id == id)
        {
            date = element.date;
        }
        index++;
    });

    return date;
}

function timestampToDate(timestamp){
	var date = new Date(timestamp);
	var year = date.getFullYear();
	var month = date.getMonth() + 1 ;
	var day = date.getDate();
	var hours = date.getHours() + 1;
	var min = date.getMinutes();
	var str = year + "." + month + "." + day + " " + hours + ":" + min;
	return str
}
