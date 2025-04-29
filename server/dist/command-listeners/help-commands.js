"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCommands = void 0;
const jcv_ts_utils_1 = require("jcv-ts-utils");
var pickRandomOne = jcv_ts_utils_1.ArrayUtils.pickRandomOne;
const recentMessages = []; // Stockage des derniers messages du chat
const recentPhrases = [];
const memory = []; // Mémoire pour garder les mots-clés
const possibleCommands = {
    bonjour: ["bonjour", "salut", "yo", "coucou", "bienvenue", "helloo", "bonjouur", "salut tout le monde"],
    blague: ["blague", "une blague", "raconte une blague", "tu connais une blague ?", "blague pls", "t'es drôle ou quoi ?"],
    mood: ["mood", "comment ça va", "ça va ?", "comment tu te sens", "t'es de bonne humeur", "humeur"],
    coucou: ["coucou", "coucou toi", "hey", "salut toi", "heyyyy"],
    soupir: ["soupir", "pfff", "ça va pas", "je suis fatigué", "je m'ennuie", "pff", "je veux pas parler"],
    cadeau: ["faites-moi un cadeau", "je veux un cadeau", "un petit cadeau", "cadeau please", "tu m'offres un cadeau"],
    manger: ["manger", "t'as faim", "je mange", "on mange", "gouter", "je veux manger", "trop faim"],
    lancer_de_dice: ["lancer de dé", "lance un dé", "je veux lancer un dé", "lancer de dé s'il te plait", "dice"],
    citation: ["citation", "dis une citation", "une citation", "citation inspirante", "quote"],
    feedback: ["feedback", "avis", "donne moi ton avis", "comment tu trouves ce bot", "donne un retour"],
    discord: ["discord", "invite discord", "lien discord", "join discord", "discord link", "lien d'invitation", "invitation discord"],
};
// Fonction pour vérifier si la commande correspond à une des variantes
const matchesCommand = (input, commandList) => {
    return commandList.some(variant => input.toLowerCase().includes(variant.toLowerCase()));
};
// Ajouter un message à l'historique des messages récents
const addMessageToHistory = (message) => {
    recentMessages.push(message);
    if (recentMessages.length > 5) {
        recentMessages.shift(); // Garder seulement les 5 derniers messages
    }
};
const HelpCommands = async ({ command, channel, chatBotClient, args, messageCount, }) => {
    // Réponses aléatoires (20% de chance de parler)
    const randomChance = Math.random();
    if (randomChance < 0.2) {
        const phrases = [
            "Hihihi.",
            "J'aime les bits.",
            "Vivement qu'on me bits.",
            "Bonjours à vous tihihihi.",
            "Pourquoi je parle ?",
            "Ok pourquoi pas.",
            "ALLO.",
            "MESSAGE ULTRA IMPORTANT.",
        ];
        const rand = pickRandomOne(phrases);
        const delay = Math.floor(Math.random() * 4000) + 1000;
        setTimeout(async () => {
            await chatBotClient.say(channel, rand);
            recentPhrases.push(rand);
            if (recentPhrases.length > 3) {
                recentPhrases.shift(); // Garder seulement les 3 dernières phrases
            }
        }, delay);
    }
    // Commande "discord"
    if (matchesCommand(command, possibleCommands.discord)) {
        await chatBotClient.say(channel, "Voici le lien de mon serveur Discord : https://discord.com/invite/6r8JK6g 🎉");
    }
    // Commande "bonjour" (réponse en fonction des messages précédents)
    if (matchesCommand(command, possibleCommands.bonjour)) {
        if (recentMessages.length > 0) {
            const lastMessage = recentMessages[recentMessages.length - 1];
            const rand = pickRandomOne([
                `Oh, t'as dit "${lastMessage}" ? C'est adorable ! 😘`,
                `Tu parles de "${lastMessage}" ? C'est tout à fait mon genre de conversation ! 😉`,
                `Haha, t'as dit ça : "${lastMessage}". Tu me surprends à chaque fois ! 😏`,
            ]);
            await chatBotClient.say(channel, rand);
        }
        else {
            const rand = pickRandomOne([
                "Oh, je suis toute excitée à l'idée de discuter avec toi ! 😍",
                "Tu sais que je t'aime bien, hein ? 😘",
                "Si j'étais un chat, je serais en train de te suivre partout ! 🐾",
                "T'as pas une idée géniale à partager avec moi ? 😎",
                "J'espère que tu t'es bien préparé(e) à ma folie ! 🤪",
                "Alors, qu'est-ce qu'on fait de beau aujourd'hui ? 😏",
            ]);
            await chatBotClient.say(channel, rand);
        }
    }
    // Ajouter le message actuel à l'historique
    addMessageToHistory(command);
    // Commande "blague"
    if (matchesCommand(command, possibleCommands.blague)) {
        const rand = pickRandomOne([
            "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent toujours dans le bateau ! 😂",
            "Pourquoi les poissons détestent l'ordinateur ? Parce qu’ils ont peur du net ! 🐟💻",
            "Qu’est-ce qu’un oiseau avec une corde ? Un oiseau… suspendu ! 🎵",
        ]);
        await chatBotClient.say(channel, rand);
    }
    // Commande "mood"
    if (matchesCommand(command, possibleCommands.mood) && args.length > 0) {
        const mood = args.join(" ").toLowerCase();
        if (mood.includes("heureux") || mood.includes("content")) {
            await chatBotClient.say(channel, "Yay, content de te voir de bonne humeur ! 😁");
        }
        else if (mood.includes("triste") || mood.includes("mélancolique")) {
            await chatBotClient.say(channel, "Oh non, j'espère que ça va aller mieux bientôt ! 😔💖");
        }
        else {
            await chatBotClient.say(channel, "Hmm, je vois ! 😶 Dis-moi en plus si tu veux ! 🤔");
        }
    }
    // Commande "coucou"
    if (matchesCommand(command, possibleCommands.coucou)) {
        const rand = pickRandomOne([
            "Coucou ! T'étais où pendant tout ce temps ? 😏",
            "Coucou ! 😋 Prêt à passer un bon moment ensemble ?",
            "Coucou, ça fait plaisir de te voir ! 😊",
        ]);
        await chatBotClient.say(channel, rand);
    }
    // Commande "soupir"
    if (matchesCommand(command, possibleCommands.soupir)) {
        const rand = pickRandomOne([
            "Pffff… Qu'est-ce qui ne va pas, mon ami ? 😩",
            "Un soupir ? Ahh, ça sent l'ennui ! 😴",
            "Oh là là, tout va bien ? Tu veux en parler ? 😶",
        ]);
        await chatBotClient.say(channel, rand);
    }
    // Commande "faites-moi-un-cadeau"
    if (matchesCommand(command, possibleCommands.cadeau)) {
        const rand = pickRandomOne([
            "Un cadeau ? Hmm, je t'offre une dose de bonne humeur ! 🎁",
            "Un cadeau... C’est pas encore Noël ! Mais je t’offre cette blague ! 🎉",
            "Voici le cadeau ultime... un sourire ! 😁🎁",
        ]);
        await chatBotClient.say(channel, rand);
    }
    // Commande "manger"
    if (matchesCommand(command, possibleCommands.manger)) {
        const rand = pickRandomOne([
            "Oh, tu veux manger ? J'espère que c'est un énorme gâteau ! 🍰",
            "Manger ! C'est le meilleur moment de la journée ! 😋",
            "Manger... et bien manger ! Ça me parle ça ! 🍕🍔",
        ]);
        await chatBotClient.say(channel, rand);
    }
    // Commande "lancer_de_dice"
    if (matchesCommand(command, possibleCommands.lancer_de_dice)) {
        const diceRoll = Math.floor(Math.random() * 6) + 1; // Lancer un dé de 1 à 6
        await chatBotClient.say(channel, `🎲 Tu as lancé le dé et obtenu : ${diceRoll}`);
    }
    // Commande "citation"
    if (matchesCommand(command, possibleCommands.citation)) {
        const rand = pickRandomOne([
            "« La vie est 10 % ce qui nous arrive et 90 % comment nous réagissons. » – Charles R. Swindoll",
            "« Soyez vous-même, les autres sont déjà pris. » – Oscar Wilde",
            "« On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux. » – Antoine de Saint-Exupéry",
        ]);
        await chatBotClient.say(channel, rand);
    }
    // Commande "feedback"
    if (matchesCommand(command, possibleCommands.feedback) && args.length > 0) {
        const feedback = args.join(" ");
        await chatBotClient.say(channel, `Merci pour ton feedback ! 😅 Je vais réfléchir à tout ça... Ou pas. 🤔`);
    }
};
exports.HelpCommands = HelpCommands;
