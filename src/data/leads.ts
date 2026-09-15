import type { Lead } from "@/features/leads/types";

/**
 * Jeu de données fictif, écrit à la main : 45 prospects d'une petite agence
 * web française, cohérents entre eux (montants, étapes, dates, notes).
 * Aucune donnée réelle, aucune génération aléatoire.
 * Référence temporelle du jeu : 15 septembre 2026.
 */
export const SEED_LEADS: Lead[] = [
  {
    "id": "LD-1001",
    "firstName": "Emma",
    "lastName": "Laurent",
    "company": "Studio Bloom",
    "email": "emma.laurent@studio-bloom.fr",
    "phone": "06 12 44 87 90",
    "estimatedValue": 4500,
    "status": "qualified",
    "createdAt": "2026-09-15T09:07:00.000Z",
    "notes": [
      {
        "id": "LD-1001-N1",
        "body": "Appel découverte terminé. Refonte complète du site vitrine, budget confirmé autour de 4 500 €.",
        "createdAt": "2026-09-03T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1001-N2",
        "body": "Proposition envoyée. Emma revient vers nous après son comité du 18.",
        "createdAt": "2026-09-04T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-15T11:13:00.000Z"
  },
  {
    "id": "LD-1002",
    "firstName": "Thomas",
    "lastName": "Berger",
    "company": "Atelier Nivelle",
    "email": "thomas.berger@ateliernivelle.fr",
    "phone": "06 74 21 09 38",
    "estimatedValue": 3200,
    "status": "proposal",
    "createdAt": "2026-08-24T09:14:00.000Z",
    "notes": [
      {
        "id": "LD-1002-N1",
        "body": "Devis transmis pour le catalogue produit en ligne.",
        "createdAt": "2026-09-06T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1002-N2",
        "body": "Relance téléphonique. Décision attendue fin de semaine.",
        "createdAt": "2026-09-12T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-12T11:26:00.000Z"
  },
  {
    "id": "LD-1003",
    "firstName": "Chloé",
    "lastName": "Meunier",
    "company": "Cabinet Vasseur",
    "email": "chloe.meunier@cabinet-vasseur.fr",
    "phone": "01 45 62 18 77",
    "estimatedValue": 8200,
    "status": "qualified",
    "createdAt": "2026-08-12T09:21:00.000Z",
    "notes": [
      {
        "id": "LD-1003-N1",
        "body": "Trois associés, 14 collaborateurs. Besoin d'un extranet client.",
        "createdAt": "2026-08-28T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1003-N2",
        "body": "Atelier de cadrage planifié avec le DSI.",
        "createdAt": "2026-09-09T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-09T11:39:00.000Z"
  },
  {
    "id": "LD-1004",
    "firstName": "Lucas",
    "lastName": "Morel",
    "company": "Fromagerie Delcroix",
    "email": "lucas.morel@delcroix-fromages.fr",
    "phone": "03 20 55 41 26",
    "estimatedValue": 1800,
    "status": "contacted",
    "createdAt": "2026-09-04T09:28:00.000Z",
    "notes": [
      {
        "id": "LD-1004-N1",
        "body": "Premier échange. Site e-commerce local, démarrage souhaité en novembre.",
        "createdAt": "2026-09-11T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-11T11:52:00.000Z"
  },
  {
    "id": "LD-1005",
    "firstName": "Inès",
    "lastName": "Cheriet",
    "company": "Kolam Design",
    "email": "ines.cheriet@kolam.design",
    "phone": "07 61 09 55 12",
    "estimatedValue": 6800,
    "status": "proposal",
    "createdAt": "2026-08-05T09:35:00.000Z",
    "notes": [
      {
        "id": "LD-1005-N1",
        "body": "Identité + site pour le lancement de leur gamme.",
        "createdAt": "2026-09-01T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1005-N2",
        "body": "Proposition en deux lots acceptée sur le principe.",
        "createdAt": "2026-09-13T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-13T11:05:00.000Z"
  },
  {
    "id": "LD-1006",
    "firstName": "Antoine",
    "lastName": "Rey",
    "company": "Menuiserie Rey & Fils",
    "email": "antoine.rey@menuiserie-rey.fr",
    "phone": "04 78 33 92 40",
    "estimatedValue": 2600,
    "status": "won",
    "createdAt": "2026-06-11T09:42:00.000Z",
    "notes": [
      {
        "id": "LD-1006-N1",
        "body": "Signature du devis site vitrine + prise de rendez-vous en ligne.",
        "createdAt": "2026-07-05T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1006-N2",
        "body": "Mise en ligne validée. Facture soldée.",
        "createdAt": "2026-07-19T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-19T11:18:00.000Z"
  },
  {
    "id": "LD-1007",
    "firstName": "Sarah",
    "lastName": "Nguyen",
    "company": "Hélios Énergie",
    "email": "sarah.nguyen@helios-energie.fr",
    "phone": "05 56 77 21 08",
    "estimatedValue": 12400,
    "status": "qualified",
    "createdAt": "2026-07-30T09:49:00.000Z",
    "notes": [
      {
        "id": "LD-1007-N1",
        "body": "Appel d'offres privé, trois prestataires consultés.",
        "createdAt": "2026-08-25T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1007-N2",
        "body": "Audit technique livré. Réponse attendue mi-octobre.",
        "createdAt": "2026-09-07T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-07T11:31:00.000Z"
  },
  {
    "id": "LD-1008",
    "firstName": "Julien",
    "lastName": "Faure",
    "company": "Librairie du Cours",
    "email": "julien.faure@librairieducours.fr",
    "phone": "04 91 62 33 17",
    "estimatedValue": 1400,
    "status": "contacted",
    "createdAt": "2026-09-07T09:56:00.000Z",
    "notes": [],
    "lastContactAt": "2026-09-10T11:44:00.000Z"
  },
  {
    "id": "LD-1009",
    "firstName": "Nadia",
    "lastName": "Benali",
    "company": "Crèche Les Petits Pas",
    "email": "nadia.benali@lespetitspas.fr",
    "phone": "02 40 18 76 55",
    "estimatedValue": 900,
    "status": "new",
    "createdAt": "2026-09-12T09:03:00.000Z",
    "notes": []
  },
  {
    "id": "LD-1010",
    "firstName": "Pierre",
    "lastName": "Delahaye",
    "company": "Delahaye Transports",
    "email": "pierre.delahaye@delahaye-transports.fr",
    "phone": "02 35 49 60 12",
    "estimatedValue": 9600,
    "status": "proposal",
    "createdAt": "2026-07-25T09:10:00.000Z",
    "notes": [
      {
        "id": "LD-1010-N1",
        "body": "Portail de suivi de tournées pour 22 chauffeurs.",
        "createdAt": "2026-08-20T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1010-N2",
        "body": "Proposition chiffrée à 9 600 €, arbitrage budgétaire en cours.",
        "createdAt": "2026-09-08T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-08T11:10:00.000Z"
  },
  {
    "id": "LD-1011",
    "firstName": "Camille",
    "lastName": "Roussel",
    "company": "Roussel Photographie",
    "email": "camille.roussel@camilleroussel.photo",
    "phone": "06 88 30 14 77",
    "estimatedValue": 1250,
    "status": "won",
    "createdAt": "2026-05-20T09:17:00.000Z",
    "notes": [
      {
        "id": "LD-1011-N1",
        "body": "Portfolio en ligne, livraison en trois semaines.",
        "createdAt": "2026-06-11T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1011-N2",
        "body": "Projet clôturé, recommandation obtenue.",
        "createdAt": "2026-07-03T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-03T11:23:00.000Z"
  },
  {
    "id": "LD-1012",
    "firstName": "Maxime",
    "lastName": "Girard",
    "company": "Brasserie du Quai",
    "email": "maxime.girard@brasserieduquai.fr",
    "phone": "03 81 44 07 29",
    "estimatedValue": 2100,
    "status": "contacted",
    "createdAt": "2026-08-30T09:24:00.000Z",
    "notes": [
      {
        "id": "LD-1012-N1",
        "body": "Rendez-vous fixé pour cadrer la carte en ligne.",
        "createdAt": "2026-09-09T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-09T11:36:00.000Z"
  },
  {
    "id": "LD-1013",
    "firstName": "Léa",
    "lastName": "Fontaine",
    "company": "Fontaine Immobilier",
    "email": "lea.fontaine@fontaine-immo.fr",
    "phone": "04 93 12 58 61",
    "estimatedValue": 7300,
    "status": "qualified",
    "createdAt": "2026-08-17T09:31:00.000Z",
    "notes": [
      {
        "id": "LD-1013-N1",
        "body": "38 biens à publier, synchronisation avec leur logiciel métier.",
        "createdAt": "2026-08-31T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1013-N2",
        "body": "Accès API obtenus côté client.",
        "createdAt": "2026-09-11T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-11T11:49:00.000Z"
  },
  {
    "id": "LD-1014",
    "firstName": "Karim",
    "lastName": "Haddad",
    "company": "Garage Haddad",
    "email": "karim.haddad@garage-haddad.fr",
    "phone": "04 72 90 33 18",
    "estimatedValue": 1600,
    "status": "new",
    "createdAt": "2026-09-10T09:38:00.000Z",
    "notes": []
  },
  {
    "id": "LD-1015",
    "firstName": "Sophie",
    "lastName": "Brunet",
    "company": "Cabinet Brunet Conseil",
    "email": "sophie.brunet@brunet-conseil.fr",
    "phone": "01 56 74 20 39",
    "estimatedValue": 4800,
    "status": "contacted",
    "createdAt": "2026-08-27T09:45:00.000Z",
    "notes": [
      {
        "id": "LD-1015-N1",
        "body": "Besoin identifié : espace documentaire client sécurisé.",
        "createdAt": "2026-09-06T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-06T11:15:00.000Z"
  },
  {
    "id": "LD-1016",
    "firstName": "Victor",
    "lastName": "Lemoine",
    "company": "Cave Lemoine",
    "email": "victor.lemoine@cave-lemoine.fr",
    "phone": "03 26 88 17 44",
    "estimatedValue": 3400,
    "status": "won",
    "createdAt": "2026-06-24T09:52:00.000Z",
    "notes": [
      {
        "id": "LD-1016-N1",
        "body": "Boutique en ligne avec gestion des millésimes.",
        "createdAt": "2026-07-11T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1016-N2",
        "body": "Formation de l'équipe effectuée.",
        "createdAt": "2026-08-02T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-08-02T11:28:00.000Z"
  },
  {
    "id": "LD-1017",
    "firstName": "Amélie",
    "lastName": "Perrot",
    "company": "Perrot Architecture",
    "email": "amelie.perrot@perrot-archi.fr",
    "phone": "05 61 28 95 03",
    "estimatedValue": 5900,
    "status": "proposal",
    "createdAt": "2026-08-08T09:59:00.000Z",
    "notes": [
      {
        "id": "LD-1017-N1",
        "body": "Book de projets, très exigeante sur la typographie.",
        "createdAt": "2026-08-27T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1017-N2",
        "body": "Maquettes présentées, retours positifs.",
        "createdAt": "2026-09-10T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-10T11:41:00.000Z"
  },
  {
    "id": "LD-1018",
    "firstName": "Hugo",
    "lastName": "Barbier",
    "company": "Barbier Paysagiste",
    "email": "hugo.barbier@barbier-paysage.fr",
    "phone": "02 99 51 40 82",
    "estimatedValue": 1150,
    "status": "contacted",
    "createdAt": "2026-09-02T09:06:00.000Z",
    "notes": [],
    "lastContactAt": "2026-09-08T11:54:00.000Z"
  },
  {
    "id": "LD-1019",
    "firstName": "Manon",
    "lastName": "Dufour",
    "company": "Épicerie Dufour",
    "email": "manon.dufour@epicerie-dufour.fr",
    "phone": "04 66 21 73 50",
    "estimatedValue": 750,
    "status": "new",
    "createdAt": "2026-09-13T09:13:00.000Z",
    "notes": []
  },
  {
    "id": "LD-1020",
    "firstName": "Rémi",
    "lastName": "Chauvet",
    "company": "Chauvet Sport",
    "email": "remi.chauvet@chauvet-sport.fr",
    "phone": "03 85 60 29 11",
    "estimatedValue": 2900,
    "status": "contacted",
    "createdAt": "2026-08-22T09:20:00.000Z",
    "notes": [
      {
        "id": "LD-1020-N1",
        "body": "Catalogue de 400 références, migration depuis un ancien site.",
        "createdAt": "2026-09-05T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-05T11:20:00.000Z"
  },
  {
    "id": "LD-1021",
    "firstName": "Fatima",
    "lastName": "Ziani",
    "company": "Clinique Vétérinaire Arago",
    "email": "fatima.ziani@veto-arago.fr",
    "phone": "05 57 40 66 92",
    "estimatedValue": 2350,
    "status": "won",
    "createdAt": "2026-05-29T09:27:00.000Z",
    "notes": [
      {
        "id": "LD-1021-N1",
        "body": "Prise de rendez-vous en ligne et rappels automatiques.",
        "createdAt": "2026-06-19T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1021-N2",
        "body": "Recette validée par la clinique.",
        "createdAt": "2026-07-16T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-16T11:33:00.000Z"
  },
  {
    "id": "LD-1022",
    "firstName": "Nicolas",
    "lastName": "Perrin",
    "company": "Perrin Électricité",
    "email": "nicolas.perrin@perrin-elec.fr",
    "phone": "02 41 75 33 08",
    "estimatedValue": 980,
    "status": "lost",
    "createdAt": "2026-07-13T09:34:00.000Z",
    "notes": [
      {
        "id": "LD-1022-N1",
        "body": "Budget réaffecté à leur flotte de véhicules. À recontacter en 2027.",
        "createdAt": "2026-08-06T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-08-06T11:46:00.000Z"
  },
  {
    "id": "LD-1023",
    "firstName": "Clara",
    "lastName": "Marchand",
    "company": "Atelier Marchand",
    "email": "clara.marchand@atelier-marchand.fr",
    "phone": "04 77 19 52 63",
    "estimatedValue": 3100,
    "status": "qualified",
    "createdAt": "2026-08-20T09:41:00.000Z",
    "notes": [
      {
        "id": "LD-1023-N1",
        "body": "Céramiste, veut vendre en direct.",
        "createdAt": "2026-09-03T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1023-N2",
        "body": "Périmètre arrêté sur une boutique simple.",
        "createdAt": "2026-09-12T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-12T11:59:00.000Z"
  },
  {
    "id": "LD-1024",
    "firstName": "Étienne",
    "lastName": "Rolland",
    "company": "Rolland Assurances",
    "email": "etienne.rolland@rolland-assur.fr",
    "phone": "03 29 66 04 51",
    "estimatedValue": 5400,
    "status": "contacted",
    "createdAt": "2026-08-25T09:48:00.000Z",
    "notes": [],
    "lastContactAt": "2026-09-07T11:12:00.000Z"
  },
  {
    "id": "LD-1025",
    "firstName": "Yasmine",
    "lastName": "Berthier",
    "company": "Institut Berthier",
    "email": "yasmine.berthier@institut-berthier.fr",
    "phone": "01 47 38 91 26",
    "estimatedValue": 1900,
    "status": "new",
    "createdAt": "2026-09-09T09:55:00.000Z",
    "notes": []
  },
  {
    "id": "LD-1026",
    "firstName": "Damien",
    "lastName": "Leroux",
    "company": "Leroux Motoculture",
    "email": "damien.leroux@leroux-motoculture.fr",
    "phone": "02 54 82 37 19",
    "estimatedValue": 1350,
    "status": "won",
    "createdAt": "2026-06-16T09:02:00.000Z",
    "notes": [
      {
        "id": "LD-1026-N1",
        "body": "Site catalogue avec demande de devis.",
        "createdAt": "2026-07-07T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1026-N2",
        "body": "Livré dans les délais, client satisfait.",
        "createdAt": "2026-07-25T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-25T11:38:00.000Z"
  },
  {
    "id": "LD-1027",
    "firstName": "Alice",
    "lastName": "Guérin",
    "company": "Guérin Traiteur",
    "email": "alice.guerin@guerin-traiteur.fr",
    "phone": "05 45 90 12 74",
    "estimatedValue": 2750,
    "status": "proposal",
    "createdAt": "2026-08-13T09:09:00.000Z",
    "notes": [
      {
        "id": "LD-1027-N1",
        "body": "Devis en ligne pour les prestations événementielles.",
        "createdAt": "2026-08-30T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1027-N2",
        "body": "Proposition relue par leur comptable.",
        "createdAt": "2026-09-11T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-11T11:51:00.000Z"
  },
  {
    "id": "LD-1028",
    "firstName": "Benoît",
    "lastName": "Colin",
    "company": "Colin Menuiseries",
    "email": "benoit.colin@colin-menuiseries.fr",
    "phone": "03 44 71 58 20",
    "estimatedValue": 4100,
    "status": "qualified",
    "createdAt": "2026-08-15T09:16:00.000Z",
    "notes": [
      {
        "id": "LD-1028-N1",
        "body": "Configurateur simple de fenêtres, deux ateliers concernés.",
        "createdAt": "2026-09-06T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-06T11:04:00.000Z"
  },
  {
    "id": "LD-1029",
    "firstName": "Laure",
    "lastName": "Vidal",
    "company": "Vidal Kinésithérapie",
    "email": "laure.vidal@vidal-kine.fr",
    "phone": "04 67 15 82 39",
    "estimatedValue": 680,
    "status": "new",
    "createdAt": "2026-09-11T09:23:00.000Z",
    "notes": []
  },
  {
    "id": "LD-1030",
    "firstName": "Samir",
    "lastName": "Toumi",
    "company": "Toumi Bâtiment",
    "email": "samir.toumi@toumi-batiment.fr",
    "phone": "01 64 22 90 57",
    "estimatedValue": 6200,
    "status": "contacted",
    "createdAt": "2026-08-19T09:30:00.000Z",
    "notes": [
      {
        "id": "LD-1030-N1",
        "body": "Espace chantier pour leurs clients particuliers.",
        "createdAt": "2026-09-04T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-04T11:30:00.000Z"
  },
  {
    "id": "LD-1031",
    "firstName": "Juliette",
    "lastName": "Masson",
    "company": "Masson Fleurs",
    "email": "juliette.masson@masson-fleurs.fr",
    "phone": "02 47 60 35 82",
    "estimatedValue": 1050,
    "status": "won",
    "createdAt": "2026-07-01T09:37:00.000Z",
    "notes": [
      {
        "id": "LD-1031-N1",
        "body": "Boutique de bouquets avec livraison sur trois communes.",
        "createdAt": "2026-07-17T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1031-N2",
        "body": "Reconduction du contrat de maintenance.",
        "createdAt": "2026-08-08T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-08-08T11:43:00.000Z"
  },
  {
    "id": "LD-1032",
    "firstName": "Olivier",
    "lastName": "Charpentier",
    "company": "Charpentier Optique",
    "email": "olivier.charpentier@charpentier-optique.fr",
    "phone": "03 88 23 46 70",
    "estimatedValue": 2200,
    "status": "lost",
    "createdAt": "2026-07-19T09:44:00.000Z",
    "notes": [
      {
        "id": "LD-1032-N1",
        "body": "Parti chez un prestataire local moins cher.",
        "createdAt": "2026-08-10T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-08-10T11:56:00.000Z"
  },
  {
    "id": "LD-1033",
    "firstName": "Elsa",
    "lastName": "Bourgeois",
    "company": "Bourgeois Pâtisserie",
    "email": "elsa.bourgeois@bourgeois-patisserie.fr",
    "phone": "04 76 41 09 63",
    "estimatedValue": 1700,
    "status": "new",
    "createdAt": "2026-09-08T09:51:00.000Z",
    "notes": []
  },
  {
    "id": "LD-1034",
    "firstName": "Mathieu",
    "lastName": "Renard",
    "company": "Renard Sécurité",
    "email": "mathieu.renard@renard-securite.fr",
    "phone": "05 59 33 78 24",
    "estimatedValue": 8900,
    "status": "qualified",
    "createdAt": "2026-08-02T09:58:00.000Z",
    "notes": [
      {
        "id": "LD-1034-N1",
        "body": "Portail de supervision pour 60 sites clients.",
        "createdAt": "2026-08-23T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1034-N2",
        "body": "Démonstration technique programmée.",
        "createdAt": "2026-09-09T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-09T11:22:00.000Z"
  },
  {
    "id": "LD-1035",
    "firstName": "Aurélie",
    "lastName": "Poirier",
    "company": "Poirier Coiffure",
    "email": "aurelie.poirier@poirier-coiffure.fr",
    "phone": "02 96 55 21 08",
    "estimatedValue": 620,
    "status": "contacted",
    "createdAt": "2026-09-05T09:05:00.000Z",
    "notes": [],
    "lastContactAt": "2026-09-09T11:35:00.000Z"
  },
  {
    "id": "LD-1036",
    "firstName": "Bastien",
    "lastName": "Lambert",
    "company": "Lambert Vélo",
    "email": "bastien.lambert@lambert-velo.fr",
    "phone": "04 79 62 14 55",
    "estimatedValue": 3600,
    "status": "won",
    "createdAt": "2026-06-05T09:12:00.000Z",
    "notes": [
      {
        "id": "LD-1036-N1",
        "body": "Atelier de réparation : prise de rendez-vous et suivi.",
        "createdAt": "2026-06-27T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1036-N2",
        "body": "Mise en production sans incident.",
        "createdAt": "2026-07-11T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-11T11:48:00.000Z"
  },
  {
    "id": "LD-1037",
    "firstName": "Nina",
    "lastName": "Gauthier",
    "company": "Gauthier Céramique",
    "email": "nina.gauthier@gauthier-ceramique.fr",
    "phone": "03 80 47 92 16",
    "estimatedValue": 1450,
    "status": "new",
    "createdAt": "2026-09-14T09:19:00.000Z",
    "notes": []
  },
  {
    "id": "LD-1038",
    "firstName": "Paul",
    "lastName": "Mercier",
    "company": "Mercier Agencement",
    "email": "paul.mercier@mercier-agencement.fr",
    "phone": "01 60 84 37 29",
    "estimatedValue": 5100,
    "status": "proposal",
    "createdAt": "2026-08-10T09:26:00.000Z",
    "notes": [
      {
        "id": "LD-1038-N1",
        "body": "Refonte du site et du catalogue PDF.",
        "createdAt": "2026-08-28T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1038-N2",
        "body": "Chiffrage validé en interne, signature imminente.",
        "createdAt": "2026-09-13T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-13T11:14:00.000Z"
  },
  {
    "id": "LD-1039",
    "firstName": "Salomé",
    "lastName": "Lecomte",
    "company": "Lecomte Édition",
    "email": "salome.lecomte@lecomte-edition.fr",
    "phone": "04 42 71 63 90",
    "estimatedValue": 4300,
    "status": "contacted",
    "createdAt": "2026-08-23T09:33:00.000Z",
    "notes": [
      {
        "id": "LD-1039-N1",
        "body": "Catalogue d'ouvrages et vente en direct.",
        "createdAt": "2026-09-03T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-03T11:27:00.000Z"
  },
  {
    "id": "LD-1040",
    "firstName": "Raphaël",
    "lastName": "Bertrand",
    "company": "Bertrand Charpente",
    "email": "raphael.bertrand@bertrand-charpente.fr",
    "phone": "02 31 09 55 47",
    "estimatedValue": 2850,
    "status": "won",
    "createdAt": "2026-06-20T09:40:00.000Z",
    "notes": [
      {
        "id": "LD-1040-N1",
        "body": "Site vitrine avec galerie de réalisations.",
        "createdAt": "2026-07-09T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1040-N2",
        "body": "Projet clos, avis client publié.",
        "createdAt": "2026-07-28T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-28T11:40:00.000Z"
  },
  {
    "id": "LD-1041",
    "firstName": "Margaux",
    "lastName": "Hubert",
    "company": "Hubert Nautisme",
    "email": "margaux.hubert@hubert-nautisme.fr",
    "phone": "02 97 66 30 15",
    "estimatedValue": 7600,
    "status": "qualified",
    "createdAt": "2026-08-07T09:47:00.000Z",
    "notes": [
      {
        "id": "LD-1041-N1",
        "body": "Location de bateaux, calendrier de disponibilité.",
        "createdAt": "2026-08-26T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1041-N2",
        "body": "Étude de faisabilité rendue.",
        "createdAt": "2026-09-08T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-09-08T11:53:00.000Z"
  },
  {
    "id": "LD-1042",
    "firstName": "Théo",
    "lastName": "Roche",
    "company": "Roche Informatique",
    "email": "theo.roche@roche-info.fr",
    "phone": "04 90 28 51 73",
    "estimatedValue": 1150,
    "status": "lost",
    "createdAt": "2026-07-07T09:54:00.000Z",
    "notes": [
      {
        "id": "LD-1042-N1",
        "body": "Projet reporté sine die après un changement de direction.",
        "createdAt": "2026-08-01T14:00:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-08-01T11:06:00.000Z"
  },
  {
    "id": "LD-1043",
    "firstName": "Louise",
    "lastName": "Dumas",
    "company": "Dumas Orthodontie",
    "email": "louise.dumas@dumas-ortho.fr",
    "phone": "05 62 18 40 96",
    "estimatedValue": 1980,
    "status": "won",
    "createdAt": "2026-06-13T09:01:00.000Z",
    "notes": [
      {
        "id": "LD-1043-N1",
        "body": "Site de cabinet avec informations patients.",
        "createdAt": "2026-07-03T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1043-N2",
        "body": "Livraison conforme au cahier des charges.",
        "createdAt": "2026-07-22T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-22T11:19:00.000Z"
  },
  {
    "id": "LD-1044",
    "firstName": "Kevin",
    "lastName": "Marty",
    "company": "Marty Événements",
    "email": "kevin.marty@marty-events.fr",
    "phone": "01 69 45 82 30",
    "estimatedValue": 5750,
    "status": "won",
    "createdAt": "2026-05-25T09:08:00.000Z",
    "notes": [
      {
        "id": "LD-1044-N1",
        "body": "Plateforme de billetterie pour leurs soirées.",
        "createdAt": "2026-06-15T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1044-N2",
        "body": "Deuxième saison reconduite.",
        "createdAt": "2026-07-07T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-07-07T11:32:00.000Z"
  },
  {
    "id": "LD-1045",
    "firstName": "Zoé",
    "lastName": "Blanchard",
    "company": "Blanchard Fromages",
    "email": "zoe.blanchard@blanchard-fromages.fr",
    "phone": "03 84 50 27 61",
    "estimatedValue": 2450,
    "status": "won",
    "createdAt": "2026-06-28T09:15:00.000Z",
    "notes": [
      {
        "id": "LD-1045-N1",
        "body": "Vente en ligne d'un affineur, expédition sous 48 h.",
        "createdAt": "2026-07-15T14:00:00.000Z",
        "author": "Alex Martin"
      },
      {
        "id": "LD-1045-N2",
        "body": "Campagne de lancement accompagnée.",
        "createdAt": "2026-08-05T14:23:00.000Z",
        "author": "Alex Martin"
      }
    ],
    "lastContactAt": "2026-08-05T11:45:00.000Z"
  },
];
