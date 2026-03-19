/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly dataSource: DataSource) {}

	async seed(): Promise<void> {
		const categoriesRepository = this.dataSource.getRepository(Category);
		const menuItemsRepository = this.dataSource.getRepository(MenuItem);
		const usersRepository = this.dataSource.getRepository(User);

		const categoriesMap = await this.ensureCategories(categoriesRepository);
		await this.ensureMenuItems(menuItemsRepository, categoriesMap);
		await this.ensureAdminUser(usersRepository);

		this.logger.log('Seed termine avec succes.');
	}

	private async ensureAdminUser(
		usersRepository: Repository<User>,
	): Promise<void> {
		const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? '').trim().toLowerCase();
		const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? '';

		if (!adminEmail || !adminPassword) {
			this.logger.warn(
				'SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD absents: creation admin ignoree.',
			);
			return;
		}

		let adminUser = await usersRepository.findOne({
			where: { email: adminEmail },
		});

		const passwordHash = await argon2.hash(adminPassword);

		if (!adminUser) {
			adminUser = usersRepository.create({
				lastName: null,
				firstName: null,
				phone: null,
				email: adminEmail,
				passwordHash,
				role: 'admin',
			});
			await usersRepository.save(adminUser);
			this.logger.log(`Admin seed cree: ${adminEmail}`);
			return;
		}

		adminUser.role = 'admin';
		adminUser.passwordHash = passwordHash;
		await usersRepository.save(adminUser);
		this.logger.log(`Admin seed mis a jour: ${adminEmail}`);
	}

	// This method ensures that the predefined categories exist in the database.
	private async ensureCategories(
		categoriesRepository: Repository<Category>,
	): Promise<Map<string, Category>> {
		// Define the category names we want to ensure exist in the database.
		const categoryNames = [
			'COMPTOIRE DE LA MER', 
			'VIANDES', 
			'ENTRÉES', 
			'SALADES', 
			'BURGERS', 
			'PÂTES & RISOTTO', 
			'NOTRE CRÉATION VÉGÉTARIENNE', 
			'POISSONS', 
			'FROMAGES', 
			'LES CROQUES', 
			'LES PLANCHES', 
			'FINGER FOOD', 
			'DESSERTS', 
			'GLACES & SORBETS', 
			'CHAMPAGNES', 
			'EAUX', 
			'HAPPY HOUR', 
			'APÉRITIFS', 
			'BIÈRES PRESSIONS', 
			'BIÈRES BOUTEILLES', 
			'SODA', 
			'THÉS GLACÉS MAISON', 
			'LES FRUITS PRESSES ET DRINKS VITAMINEES FAITS MINUTE',
			'LES CLASSIQUES', // Category for cocktails
			'LES INCONTOURNABLES', // Category for cocktails
			'LES SIGNATURES', // Category for cocktails
			'LES SANS ALCOOLS', // Category for non-alcoholic cocktails
			'BLANCS', // Category for wines
			'ROSÉS', // Category for wines
			'ROUGES', // Category for wines
			'BOISSONS CHAUDES',
			'PETITS DÉJEUNERS', 
			'PETITS DÉJEUNERS À LA CARTE',
			'FORMULES DÉJEUNER',
			'PLATS',
			
		];
		const categoriesMap = new Map<string, Category>();

		for (const categoryName of categoryNames) {
			let category = await categoriesRepository.findOne({
				where: { name: categoryName },
			});

			if (!category) {
				category = categoriesRepository.create({ name: categoryName });
				category = await categoriesRepository.save(category);
			}

			categoriesMap.set(categoryName, category);
		}

		return categoriesMap;
	}

	private async ensureMenuItems(
		menuItemsRepository: Repository<MenuItem>,
		categoriesMap: Map<string, Category>,
	): Promise<void> {
		let insertedCount = 0;
		let updatedCount = 0;
		let skippedCount = 0;
		let deduplicatedCount = 0;

		// Define the menu items we want to ensure exist in the database.
		const seedItems: Array<{
			name: string;
			legacyNames?: string[];
			description: string | null;
			legacyDescriptions?: string[];
			price: number | null;
			priceGourmand: number | null;
			priceTresGourmand?: number | null;
			legacyPrices?: number[];
			imageUrl: string | null;
			isAvailable: boolean;
			categoryName: string;

			// Legacy*NAME* refers to the practice of matching an existing item's name, description, 
			// price, etc against legacy values, allowing for updates without losing associations with 
			// other references in the database, such as in orders.

		}> = [

			// ----- Comptoire de la mer -----

			{
				name: '6 huîtres fines de claire N°3',
				description: null,
				legacyDescriptions: [''],
				price: 1650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'COMPTOIRE DE LA MER',
			},

			{
				name: '12 huîtres fines de claire N°3',
				description: null,
				legacyDescriptions: [''],
				price: 2900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'COMPTOIRE DE LA MER',
			},

			{
				name: 'ASSIETTE DE SAUMON FUMÉ, CRÈME FRAÎCHE ACIDULÉE',
				legacyNames: ['ASSIETTE DE SAUMON FUMÉ? CRÈME FRAÎCHE ACIDULÉE'],
				description: null,
				legacyDescriptions: [''],
				price: 2200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'COMPTOIRE DE LA MER',
			},

			// ----- Viandes -----

			{
				name: 'PAVÉ DE RUMSTEAK SIMMENTAL GRILLÉ, SAUCE AU CHOIX, FRITES',
				legacyNames: ['PAVÉ DE RUMSTEAK SIMMENTAL GRILL2, SAUCE AU CHOIX, FRITES'],
				description: null,
				legacyDescriptions: [''],
				price: 2150,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: 'ENTRECÔTE DE BOEUF SIMMENTAL DE 350 G, SAUCE AU CHOIX, FRITES',
				legacyNames: ['ENTRECÔTE DE BOEUF SIMMENTAL DE 350G, SAUCE AU CHOIX, FRITES'],
				description: null,
				legacyDescriptions: [''],
				price: 3600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: 'TARTARE DE BOEUF AU COUTEAU, FRITES',
				description: null,
				legacyDescriptions: [''],
				price: 1990,
				priceGourmand: null,
				legacyPrices: [1909],
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: 'MAGRET DE CANARD FRANÇAIS IGP SUD-OUEST JUSTE ROSÉ, JUS DE CUISSON À LA FRAMBOISE, CAROTTES RÔTIES MIEL & THYM',
				legacyNames: [
					'MAGRET DE CANNARD FRANÇAIS IGP SUD OUEST JUSTE ROSÉ, JUS DE CUISSON À LA FRAMBOISE, CAROTTES RÔTIES MIEL & THYM',
				],
				description: null,
				legacyDescriptions: [''],
				price: 2750,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: 'ESCALOPE DE VEAU MILANAISE, PURÉE DE POMME DE TERRE',
				description: null,
				legacyDescriptions: [''],
				price: 2350,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: "SUPRÊME DE POULET LAQUÉ AU JUS DE VIANDE, PURÉE DE PATATE DOUCE, VIERGE D'OLIVES TAGGIASCHE",
				legacyNames: [
					"SUPRÊME DE POULET LAQUÉ AU JUS DE VIANDE? PURÉE DE PATATE DOUCE, VIERGE D'OLIVES TAGGIASCHE",
				],
				description: null,
				legacyDescriptions: [''],
				price: 2600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: "FILET DE BOEUF FLAMBÉ AU THYM, POLENTA CRÉMEUSE",
				legacyNames: ["FILLET DE BOEUF FLAMBÉ AU THYM, POLENTA CRÉMEUSE"],
				description: null,
				legacyDescriptions: [''],
				price: 4500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: "CÔTE DE BOEUF GRILLÉE (ENVIRON 1 KG) POUR DEUX PERSONNES",
				legacyNames: ["CÔTE DE BOEUF GRILLÉE (ENVIRON 1KG) POUR DEUX PERSONNES"],
				description: 'Sauce et garniture au choix',
				price: 10500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: "ONGLET DE BOEUF - 100 G",
				description: 'Sauce et garniture au choix',
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			{
				name: "SUPPLÉMENTS GARNITURES",
				description: 'frites, riz blanc, purée de pomme de terre, polenta crémeuse, haricots verts, salade, purée de patate douce, carottes rôties au miel',
				price: 6500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'VIANDES',
			},

			// ----- Entrées -----

			{
				name: "OEUF MAYONNAISE AU CHIPOTLE FUMÉ & OEUFS DE TRUITE",
				description: null,
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},

			{
				name: "HOUMOUS, SÉSAME NOIR & PAIN PITA",
				description: null,
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},			

			{
				name: "BURRATA ITALIENNE BIO DE 250 GR, VINAIGRETTE ÉPAISSE DE TOMATES, MOUTARDE À L'ANCIENNE, BASILIC",
				description: null,
				price: 1900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},

			{
				name: "HOUMOUS, SÉSAME NOIR & PAIN PITA",
				description: null,
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},

			{
				name: 'SOUPE À L\'OIGNON GRATINÉE AU CANTAL',
				description: null,
				price: 1100,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},
			{
				name: 'FOIE GRAS DE CANARD MI-CUIT AU MONBAZILLAC',
				description: null,
				price: 2500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},
			{
				name: 'CARPACCIO DE ST-JACQUES, VINAIGRETTE TRUFFÉE & YUZU',
				description: null,
				price: 2500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},
			{
				name: 'ESCARGOTS DE BOURGOGNE (PAR 6)',
				description: null,
				price: 1050,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},
			{
				name: 'ESCARGOTS DE BOURGOGNE (PAR 12)',
				description: null,
				price: 2100,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ENTRÉES',
			},

			// ----- Salades -----

			{
				name: 'LA CÉSAR',
				description: 'Romaine, poulet croustillant, parmesan, oeuf, croûtons, sauce César',
				price: 1800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SALADES',
			},
			{
				name: 'SALADE DE CHÈVRE CHAUD',
				description: 'Coeur de Sucrine, pousses d\'épinards, croustillant de crottin de chèvre affiné de Laurent Valette, noix, vinaigrette aux noix',
				price: 1950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SALADES',
			},
			{
				name: 'SALADE ITALIENNE',
				description: 'Tomates cerises, melon charentais, burrata, jambon de pays, vinaigrette huile d\'olive et vinaigre de Xérès',
				price: 1950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SALADES',
			},
			{
				name: 'SALADE FRUITÉE DE GAMBAS & AVOCAT',
				description: 'Gambas pochées, avocat, framboises, roquette, romaine, amandes grillées, vinaigrette gambas',
				price: 1950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SALADES',
			},

			// ----- Burgers -----

			{
				name: 'CLASSIC CHEESE BURGER',
				description: 'Steak haché, cheddar, salade roquette, oignons rouges, pickles, tomates, servi avec des frites maison',
				price: 1850,
				priceGourmand: 3550,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BURGERS',
			},
			{
				name: 'CHICKEN BURGER',
				description: 'Fried chicken ail & paprika, sauce yaourt ail et citron vert, pimientos de padron, pousses d\'épinards, servi avec des frites maison',
				price: 1990,
				priceGourmand: 3850,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BURGERS',
			},
			{
				name: 'LE BLUE BURGER',
				description: 'Steak haché, roquefort, avec ou sans bacon, salade roquette, oignons rouges, pickles, tomates, servi avec des frites maison',
				price: 1900,
				priceGourmand: 3750,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BURGERS',
			},
			{
				name: 'FISH BURGER',
				description: 'Colin pané, pousses d\'épinards, sauce tartare, oignons rouges, tomates pickles, servi avec des frites maison',
				price: 1900,
				priceGourmand: 3750,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BURGERS',
			},

			// ----- Pâtes & Risotto -----

			{
				name: 'TAGLIATELLES FRAÎCHES, SAUCE TOMATE, SIPHON DE PARMESAN',
				description: null,
				price: 1850,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PÂTES & RISOTTO',
			},
			{
				name: 'TAGLIATELLES FRAÎCHES À LA CRÈME DE TRUFFE',
				description: null,
				price: 2600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PÂTES & RISOTTO',
			},
			{
				name: 'RISOTTO DE LANGOUSTINES',
				description: null,
				price: 2800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PÂTES & RISOTTO',
			},

			// ----- Notre création végétarienne -----

		  	{
				name: 'TARTE FINE AUX LÉGUMES D\'ÉTÉ',
				description: null,
				price: 1900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'NOTRE CRÉATION VÉGÉTARIENNE',
			},

			// ----- Poissons -----

			{
				name: 'FISH AND CHIPS DE COLIN, SAUCE TARTARE',
				description: null,
				price: 1990,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'POISSONS',
			},
			{
				name: 'FILET DE BAR GRILLÉ, RATATOUILLE DE SAISON',
				description: null,
				price: 2500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'POISSONS',
			},
			{
				name: 'ST-JACQUES SNACKÉES À LA FLEUR DE SEL, GNOCCHIS & PURÉE DE PETITS POIS',
				description: null,
				price: 2900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'POISSONS',
			},
			{
				name: 'SOLE MEUNIÈRE (ENVIRON 550G) POUR 2 PERSONNES',
				description: 'Garniture au choix',
				price: 7500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'POISSONS',
			},

			// ----- Fromages -----

			{
				name: 'ASSIETTE DE SAINT-MARCELLIN OU CANTAL OU SAINT-NECTAIRE OU CROTTIN DE CHÈVRE FRAIS AFFINÉ DE LAURENT VALETTE',
				description: null,
				price: 1250,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FROMAGES',
			},
			{
				name: 'SAINT-MARCELLIN RÔTI À LA TRUFFE D\'ÉTÉ',
				description: null,
				price: 1650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FROMAGES',
			},
			{
				name: 'ASSIETTE DE 3 FROMAGES',
				description: null,
				price: 1650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FROMAGES',
			},

			// ----- Les croques -----

			{
				name: 'LE CROQUE-MONSIEUR (SUPP. FRITES +2.5€)',
				description: null,
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES CROQUES',
			},
			{
				name: 'LE CROQUE MADAME (SUPP. FRITES +2.5€)',
				description: null,
				price: 1500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES CROQUES',
			},
			{
				name: 'LE CROQUE AUX TRUFFES',
				description: null,
				price: 1850,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES CROQUES',
			},

			// ----- Les planches -----

			{
				name: 'PLANCHE DE CHARCUTERIE',
				description: 'Sélection de charcuterie du moment',
				price: 2200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES PLANCHES',
			},
			{
				name: 'PLANCHE DE FROMAGES AFFINÉS',
				description: 'Sélection de fromages affinés du moment',
				price: 2200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES PLANCHES',
			},
			{
				name: 'PLANCHE DE CHARCUTERIE ET FROMAGES AFFINÉS',
				description: null,
				price: 2400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES PLANCHES',
			},
			{
				name: 'PLANCHE DE TAPAS',
				description: 'Houmous & pain pita, fried chicken, accras de morue & sticks de mozzarella',
				price: 2600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES PLANCHES',
			},

			// ----- Finger food -----

			{
				name: 'ASSIETTE DE FRITES (SUPPLÉMENT TRUFFE +5€)',
				description: null,
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FINGER FOOD',
			},
			{
				name: 'ACCRAS DE MORUE',
				description: null,
				price: 900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FINGER FOOD',
			},
			{
				name: 'HOUMOUS, SÉSAME NOIR & PAIN PITA',
				description: null,
				price: 850,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FINGER FOOD',
			},
			{
				name: 'GUACAMOLE À FAIRE SOI-MÊME',
				description: null,
				price: 1150,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FINGER FOOD',
			},
			{
				name: 'STICKS DE MOZZARELLA',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FINGER FOOD',
			},
			{
				name: 'FRIED CHICKEN, AIL & PAPRIKA, SAUCE YAOURT & CITRON VERT',
				description: null,
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FINGER FOOD',
			},

			// ----- Desserts -----

			{
				name: 'BRIOCHE PERDUE AU CARAMEL BEURRE DEMI-SEL, GLACE VANILLE',
				description: null,
				price: 1000,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'MOUSSE AU CHOCOLAT DU GÉNÉRAL',
				description: null,
				price: 900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'TARTARE DE FRUITS DE SAISON',
				description: null,
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'TIRAMISU TRADITIONNEL',
				description: null,
				price: 990,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'MOELLEUX AU CHOCOLAT À PEINE CUIT & NOISETTES TORRÉFIÉES',
				description: null,
				price: 1050,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'CRÈME BRÛLÉE À LA VANILLE DE BOURBON',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'CHEESECAKE MAISON, COULIS DE FRUITS',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'PROFITEROLES, SAUCE CHOCOLAT CHAUD, GLACE AU CHOIX',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'MACARON FRAMBOISE-PISTACHE',
				description: null,
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'CAFÉ GOURMAND',
				description: null,
				price: 900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},
			{
				name: 'THÉ GOURMAND',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'DESSERTS',
			},

			// ----- Glaces & sorbets -----

			{
				name: '1 BOULE',
				description: null,
				price: 500,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: '2 BOULES',
				description: null,
				price: 900,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: '3 BOULES',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: 'CAFÉ AFFOGATO',
				description: null,
				price: 850,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: 'CAFÉ OU CHOCOLAT LIÉGEOIS',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: 'LE COLONEL',
				description: null,
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: 'COUPE TUTTI FRUTTI',
				description: 'Glaces fraise et citron, tatare de fruits et crème fouettée',
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: 'LA GOURMANDE',
				description: '1 boule de glace chocolat, 1 boule de glace vanille, Nutella, crème fouettée',
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},
			{
				name: 'CARAMEL LOVER',
				description: '2 boules caramel, 1 boule vanille, sauce caramel, crème fouettée, topping fudge caramel',
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'GLACES & SORBETS',
			},

			// ----- Champagnes -----

			{
				name: 'MERCIER BRUT',
				description: '75cl',
				price: 1350,
				priceGourmand: 8000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'CHAMPAGNES',
			},

			{
				name: 'DEUTZ',
				description: '75cl',
				price: null,
				priceGourmand: 11000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'CHAMPAGNES',
			},
			{
				name: 'LE "R" DE RUINART BRUT',
				description: '75cl',
				price: 1750,
				priceGourmand: 13000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'CHAMPAGNES',
			},
			{
				name: 'RUINART ROSÉ',
				description: '75cl',
				price: null,
				priceGourmand: 19500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'CHAMPAGNES',
			},
			{
				name: 'RUINART BLANC DE BLANCS',
				description: '75cl',
				price: null,
				priceGourmand: 19500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'CHAMPAGNES',
			},
			{
				name: 'DOM PÉRIGNON',
				description: '75cl',
				price: null,
				priceGourmand: 38000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'CHAMPAGNES',
			},
			{
				name: 'CRISTAL DE ROEDERER',
				description: '75cl',
				price: null,
				priceGourmand: 45000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'CHAMPAGNES',
			},

			// ----- Eaux -----

			{
				name: 'EVIAN',
				description: '33cl',
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'EAUX',
			},
			{
				name: 'BADOIT ROUGE',
				description: '33cl',
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'EAUX',
			},
			{
				name: 'SAN BENEDETTO PLATE',
				description: '75cl',
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'EAUX',
			},
			{
				name: 'SAN BENEDETTO GAZEUSE',
				description: '75cl',
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'EAUX',
			},				
			{
				name: 'CHATELDON (L\'EAU DES ROIS)',
				description: null,
				price: 1000,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'EAUX',
			},
			
			// ----- Happy hour -----

			{
				name: 'PINTE DE BIERE BLONDE',
				description: null,
				price: 650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'HAPPY HOUR',
			},				
			{
				name: 'GRAND VERRE DE VIN (22CL)',
				description: 'Blanc, rouge ou rosé',
				price: 650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'HAPPY HOUR',
			},
			{
				name: 'COCKTAILS',
				description: 'Gin tonic, Sex on the beach, Caipirinha, Spritz, Mojito, Moscow mule, Cuba libre, Piña colada, Cosmopolitan',
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'HAPPY HOUR',
			},
			{
				name: 'COCKTAILS SANS ALCOOL',
				description: 'Virgin colada, Virgin Spritz, Virgin sunrise, Cendrillon',
				price: 700,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'HAPPY HOUR',
			},				

			// ----- Apéritifs -----

			{
				name: 'KIR VIN BLANC - 15cl',
				description: 'Mûre, cassis, pêche',
				price: 700,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},
			{
				name: 'KIR ROYAL - 14cl',
				description: null,
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},
			{
				name: 'SUZE',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},
			{
				name: 'COUPE DE PROSECCO - 14cl',
				description: null,
				price: 790,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},
			{
				name: 'PORTO',
				description: 'Rouge ou blanc',
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},
			{
				name: 'MARTINI',
				description: 'Rouge ou blanc',
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},
			{
				name: 'CAMPARI',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},
			{
				name: 'RICARD OU PASTIS',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'APÉRITIFS',
			},

			// ----- Bières pressions -----

			{
				name: '1664',
				description: null,
				price: 550,
				priceGourmand: 1100,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BIÈRES PRESSIONS',
			},
			{
				name: 'GRIMMBERGEN «ABBAYE»',
				description: null,
				price: 600,
				priceGourmand: 1200,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BIÈRES PRESSIONS',
			},
			{
				name: '1664 BLANCHE',
				description: null,
				price: 600,
				priceGourmand: 1200,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BIÈRES PRESSIONS',
			},
			{
				name: 'IP A DEMORY',
				description: null,
				price: 600,
				priceGourmand: 1200,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BIÈRES PRESSIONS',
			},
			{
				name: 'PANACHÉ',
				description: null,
				price: 550,
				priceGourmand: 1100,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BIÈRES PRESSIONS',
			},

			// ----- Bières bouteilles -----

			{
				name: '1664 0% (SANS ALCOOL)',
				description: null,
				price: 700,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BIÈRES BOUTEILLES',
			},

			{
				name: 'DESPERADOS 8,5° , HEINEKEN, LEFFE BLONDE, PELFORT BRUNE, CORONA',
				description: null,
				price: 850,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BIÈRES BOUTEILLES',
			},

			// ----- Soda -----

			{
				name: 'RED BULL ENERGY DRINK, ORIGINAL, PASTÈQUE, SANS SUCRE - 25cl',
				description: null,
				price: 750,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SODA',
			},
			{
				name: 'COCA-COLA, COCA ZERO, COCA CHERRY, SPRITE, FANTA - 33cl',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SODA',
			},
			{
				name: 'CIDRE SASSY - 33cl',
				description: null,
				price: 700,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SODA',
			},
			{
				name: 'SCHWEPPES TONIC OU AGRUMES, ORANGINA, FUZE TEA PÊCHE	- 25cl',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SODA',
			},
			{
				name: 'MILKSHAKE',
				description: null,
				price: 1100,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'SODA',
			},

			// ----- Thés glacés maison -----

			{
				name: 'THÉ GLACÉ CITRON, PÊCHE, MENTHE FRAÎCHE, FRAMBOISE OU FRUIT DE LA PASSION',
				description: null,
				price: 650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'THÉS GLACÉS MAISON',
			},

			// ----- Les fruits pressés """""" ------

			{
				name: 'ORANGE, CITRON, PAMPLEMOUSSE, CAROTTE OU POMME',
				description: null,
				price: 750,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS FRAÎCHES',
			},
			{
				name: 'JUS ACE (ORANGE, CITRON ET CAROTTE)',
				description: null,
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS FRAÎCHES',
			},
			{
				name: 'FORMULE RPM (POMMES, CAROTTES, GINGEMBRE)',
				description: null,
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS FRAÎCHES',
			},
			{
				name: 'BONNE MINE (ORANGE, POMME, CAROTTE)',
				description: null,
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS FRAÎCHES',
			},

			// ----- Les classiques -----

			{
				name: 'NOTRE PROPOSITION DE COCKTAILS CLASSIQUES EST NON EXHAUSTIVE ET ÉVOLUE EN FONCTION DES INSPIRATIONS DU MOMENT. DEMANDEZ NOUS VOTRE COKCTAIL PRÉFÉRÉ...',
				description: 'Caipirinha, Sex on the beach, Cuba libre, Daiquiri, Americano, Bloody Mary, Cosmopolitan, Tequila sunrise, Planter, Gin fizz, Piña colada, Blue lagoon, Whisky sour, Long island, etc.',
				price: 1300,
				legacyPrices: [800],
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES CLASSIQUES',
			},

			// ----- Les incontournables -----

			{
				name: 'LES MULES',
				description: 'MOSCOW MULES\nLONDON MULES\nCARIBEAN MULES\nMEXICAN MULES\nJAGGER MULES',
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES INCONTOURNABLES',
			},
			{
				name: 'LES MARTINIS(+2€)',
				description: 'EXPRESSO MARTINI\nPORN STAR MARTINI\nFRENCH MARTINI\nDRY MARTINI\nDIRTY MARTINI',
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES INCONTOURNABLES',
			},
			{
				name: 'LES SPRITZ',
				description: 'APEROL\nCAMPARI\nLIMONCELLO\nST GERMAIN(+1€)\nVIOLETTE',
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES INCONTOURNABLES',
			},
			{
				name: 'LES NEGRONIS',
				description: 'CLASSIQUE\nMEZCAL\nVODKA\nAPEROL',
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES INCONTOURNABLES',
			},
			{
				name: 'LES MOJITOS',
				description: 'CLASSIQUE\nCHAMPAGNE(+2€)\nFRAISE\nFRUIT DE LA PASSION',
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES INCONTOURNABLES',
			},
			{
				name: 'AU REDBULL(+2€)',
				description: 'VODKA REDBULL\nGIN REDBULL PESTÈQUE',
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES INCONTOURNABLES',
			},

			// ----- Les signatures -----

			{
				name: 'LE BG',
				description: 'Gin, mangue, basilic, limonade, citron',
				legacyDescriptions: ['VODKA REDBULL\nGIN REDBULL PESTÈQUE'],
				price: 1400,
				legacyPrices: [1300],
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SIGNATURES',
			},
			{
				name: 'BASIL SMASH',
				description: 'Gin, feuille de basilic, sucre de canne, citron vert',
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SIGNATURES',
			},
			{
				name: 'POMME D\'AMOUR',
				description: 'Calvados sassy, tonic, sirop de grenadine',
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SIGNATURES',
			},

			// ----- Les sans alcools -----

			{
				name: 'RED LIMONADE',
				description: 'Coulis de fraise, citron, limonade',
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SANS ALCOOLS',
			},
			{
				name: 'PORN NO STAR',
				description: 'Coulis fruit de la passion, sirop de vanille, jus de fruit de la passion',
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SANS ALCOOLS',
			},
			{
				name: 'CENDRILLON',
				description: 'Citron vert, ananas, orange, sirop de grenadine',
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SANS ALCOOLS',
			},
			{
				name: 'DELROSE',
				description: 'Mangue, banane, purée de fraise',
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SANS ALCOOLS',
			},
			{
				name: 'SOLEIL LEVANT',
				description: 'Jus de litchi, jus de cranberry, purée de fraise',
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SANS ALCOOLS',
			},
			{
				name: 'LES VIRGINS SANS ALCOOLS',
				description: 'VIRGIN SPRITZ\nVIRGIN ST GERMAIN\nVIRGIN MOJITO\nVIRGIN PIÑA COLADA',
				price: 950,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'LES SANS ALCOOLS',
			},

			// ----- Vins blancs -----

			{
				name: 'REUILLY AOP, DOMAINE GUILLEMAIN',
				description: null,
				price: null,
				priceGourmand: null,
				priceTresGourmand: 4200,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BLANCS',
			},
			{
				name: 'POUILLY FUMÉ AOC, DOMAINE DE RIAUX BERTRAND JANNOT & FILS',
				description: null,
				price: 950,
				priceGourmand: 1350,
				priceTresGourmand: 4500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BLANCS',
			},
			{
				name: 'ALSACE RIESLING AOP, CAVE DE RIBEAUVILLÉ',
				description: null,
				price: 650,
				priceGourmand: 850,
				priceTresGourmand: 2800,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BLANCS',
			},
			{
				name: 'BEAUJOLAIS BLANC AOC, CHÂTEAU DE CORCELLES CHARDONNAY',
				description: null,
				price: 700,
				priceGourmand: 900,
				priceTresGourmand: 3500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BLANCS',
			},
			{
				name: 'CHABLIS AOC, DOMAINE DE L\'ALOUETTE BIO',
				description: null,
				price: 1050,
				priceGourmand: 1450,
				priceTresGourmand: 5400,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BLANCS',
			},
			{
				name: 'MEURSAULT AOC, DOMAINE DE PAVILLON ALBERT BICHOT',
				description: null,
				price: null,
				priceGourmand: null,
				priceTresGourmand: 19000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BLANCS',
			},
			{
				name: 'MONBAZILLAC AOC, CHÂTEAU BEAUTRAND "LIQUOREUX"',
				description: null,
				price: 750,
				priceGourmand: 1000,
				priceTresGourmand: 3100,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BLANCS',
			},

			// ----- Rosés -----

			{
				name: 'LA DEMOISELLE SANS GÊNE, IGP MÉDITERRANÉE BIO',
				description: null,
				price: 650,
				priceGourmand: 850,
				priceTresGourmand: 2900,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROSÉS',
			},
			{
				name: 'STUDIO BY MIRAVAL, IGP MÉDITERRANÉE',
				description: null,
				price: null,
				priceGourmand: null,
				priceTresGourmand: 3500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROSÉS',
			},
			{
				name: 'MINUTY PRESTIGE AOP, CÔTE DE PROVENCE',
				description: null,
				price: 1000,
				priceGourmand: 1450,
				priceTresGourmand: 5000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROSÉS',
			},

			// ----- Vins rouges -----

			{
				name: 'CHINON AOC, JM RAFFAULT, LES LUTINIÈRES',
				description: null,
				price: 700,
				priceGourmand: 1000,
				priceTresGourmand: 3500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'BROUILLY AOC, CHÂTEAU DES TOURS',
				description: null,
				price: 700,
				priceGourmand: 900,
				priceTresGourmand: 2800,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'BOURGOGNE CÔTE CHALONNAISE AOC MILLEBUIS, PINOT NOIR',
				description: null,
				price: 800,
				priceGourmand: 1150,
				priceTresGourmand: 3800,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'MERCUREY 1ER CRU "CHAMPS MARTIN", DOMAINE ADÉLIE, ALBERT BICHOT',
				description: null,
				price: null,
				priceGourmand: null,
				priceTresGourmand: 9000,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'MONTAGNE SAINT ÉMILION AOC, CHATEAU BEL AIR',
				description: null,
				price: 750,
				priceGourmand: 1050,
				priceTresGourmand: 3900,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'MOULIS AOC N°2 DE MAUCAILLOU',
				description: null,
				price: null,
				priceGourmand: null,
				priceTresGourmand: 6800,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'SAINT-ESTHÈPHE AOC, CHÂTEAU HAUT MARBUZET, H.DUBOSCQ & FILS',
				description: null,
				price: null,
				priceGourmand: null,
				priceTresGourmand: 11500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'RASTEAU AOC, "L\'ANDÉOL" FAMILLE PERRIN',
				description: null,
				price: 700,
				priceGourmand: 1000,
				priceTresGourmand: 3500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'CHÂTEAUNEUF DU PAPE AOC, LES GRANIÈRES DE LA NERTHE, BIO',
				description: null,
				price: null,
				priceGourmand: null,
				priceTresGourmand: 9500,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},
			{
				name: 'PIC SAINT-LOUP AOC, ALTITUDE 192 "TERRE HAUTE"',
				description: null,
				price: 850,
				priceGourmand: 1200,
				priceTresGourmand: 4200,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'ROUGES',
			},

			// ----- Boissons chaudes -----
			{
				name: 'EXPRESSO LADOUX OU DÉCAFÉINÉ',
				description: null,
				price: 300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'NOISETTE',
				description: null,
				price: 310,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'DOUBLE EXPRESSO, DOUBLE DÉCAFÉINÉ',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'CAFÉ CRÈME',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'CAFÉ AMÉRICAIN',
				description: null,
				price: 650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'CAPPUCCINO',
				description: null,
				price: 650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'LATTE MACCHIATO',
				description: null,
				price: 650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'UN VRAI CHOCOLAT CHAUD',
				description: null,
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'LATTE MACCHIATO NATURE, CARAMEL OU VANILLE',
				description: 'Expresso, lait chaud, caramel ou vanille, chantilly',
				price: 750,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'CAFÉ OU CHOCOLAT VIENNOIS',
				description: null,
				price: 850,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'LAIT CHAUD NATURE, AU MIEL, CARAMEL OU VANILLE',
				description: null,
				price: 650,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'VIN CHAUD À LA CANNELLE & TRANCHE D\'ORANGE',
				description: null,
				price: 700,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'GROG AU RHUM ST JAMES',
				description: null,
				price: 1100,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'IRISH OU FRENCH COFFEE',
				description: null,
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'CHOCOLAT BAILEY\'S',
				description: null,
				price: 1300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'THÉS COMPTOIR RICHARD',
				description: 'Thé noir Ceylan O.P., Grand earl Grey, Fruits rouges, Thé vert sencha ou Thé vert à la menthe fraîche',
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'TISANES BIO COMPTOIRS RICHARD',
				description: 'Verveine bio (citronnée, désaltérante), Tilleul Bio (fleurie, miellée) ou Camomille',
				price: 600,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'CAFÉ GOURMAND',
				description: 'Un expresso servi avec 3 mignardises',
				price: 990,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},
			{
				name: 'THÉ GOURMAND',
				description: 'Un thé au choix servi avec 3 mignardises',
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'BOISSONS CHAUDES',
			},

			// ----- Petits déjeuners -----

			{
				name: 'Parisien',
				description: 'CAFÉ OU THÉ OU CHOCOLAT OU CRÈME (CAPPUCCINO +1.5€), JUS D\'ORANGE PRESSÉ, CROISSANT OU PAIN AU CHOCOLAT OU TARTINE & CONFITURE',
				price: 980,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS',
			},
			{
				name: 'Continental',
				description: 'CAFÉ OU THÉ OU CHOCOLAT OU CRÈME (CAPPUCCINO +1.5€), JUS D\'ORANGE PRESSÉ, CROISSANT OU PAIN AU CHOCOLAT OU TARTINE & CONFITURE, DEUX OEUFS AU PLAT NATURE OU BACON',
				price: 1450,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS',
			},

			// ----- Petits déjeuners à la carte -----

			{
				name: 'CROISSANT',
				description: null,
				price: 200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'PAIN AU CHOCOLAT',
				description: null,
				price: 300,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			// Sandwich croissant
			{
				name: 'SANDWICH CROISSANT BACON, FROMAGE, OEUF, ROQUETTE',
				description: null,
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'SANDWICH CROISSANT SAUMON FUMÉ, CRÈME PHILADELPHIA, CIBOULETTE, ROQUETTE',
				description: null,
				price: 800,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			// Oeufs
			{
				name: 'OEUF AU PLAT',
				description: 'Nature ou bacon',
				price: 1000,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'OMELETTE',
				description: 'Nature ou herbes fines ou jambon de Paris',
				price: 1000,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'OMELETTE MIXTE',
				description: 'Jambon et fromage, salade',
				price: 1200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'AVOCADO TOAST (BACON +2€ OU SAUMON +3€)',
				description: null,
				price: 1250,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'LE CROQUE-MONSIEUR (OU MADAME +1€)',
				description: null,
				price: 1400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'LE CROQUE AUX TRUFFES',
				description: null,
				price: 1850,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'ASSIETTE DE SAUMON FUMÉ (SALMO SALAR)',
				description: 'Pain grillé et beurre conviette',
				price: 2200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'PLANCHE DE CHARCUTERIE',
				description: 'Sélection de charcuterie du moment',
				price: 2200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'PLANCHE DE FROMAGES AFFINÉS',
				description: 'Sélection de fromages affinés du moment',
				price: 2200,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},
			{
				name: 'PLANCHE DE CHARCUTERIE ET FROMAGES AFFINÉS',
				description: null,
				price: 2400,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PETITS DÉJEUNERS À LA CARTE',
			},

			// ----- Formule déjeuner -----

			{
				name: 'ENTRÉES + Plat ou Plat + Dessert',
				description: null,
				price: 1890,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FORMULES DÉJEUNER',
			},
			{
				name: 'ENTRÉES + Plat + Dessert',
				description: null,
				price: 2190,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'FORMULES DÉJEUNER',
			},

			// ----- Plats -----

			{
				name: 'BAVETTE D\'ALOYAU 160G, POMMES FRITES',
				description: null,
				price: null,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PLATS',
			},
			{
				name: 'PAVÉ DE MERLU, RATATOUILLE DE SAISON',
				description: null,
				price: null,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PLATS',
			},
			{
				name: 'SUGGESTION DU JOUR (SELON LES ENVIES DU CHEF)',
				description: null,
				price: null,
				priceGourmand: null,
				imageUrl: null,
				isAvailable: true,
				categoryName: 'PLATS',
			},
		];

		// Seed process for menu items

		for (const seedItem of seedItems) {
			const category = categoriesMap.get(seedItem.categoryName);
			if (!category) {
				continue;
			}

			const candidateNames = [seedItem.name, ...(seedItem.legacyNames ?? [])];
			const lowerCandidateNames = candidateNames.map((value) =>
				value.toLowerCase(),
			);

			const existingItems = await menuItemsRepository
				.createQueryBuilder('menuItem')
				.leftJoinAndSelect('menuItem.category', 'category')
				.where('category.id = :categoryId', { categoryId: category.id })
				.andWhere('LOWER(menuItem.name) IN (:...names)', {
					names: lowerCandidateNames,
				})
				.getMany();

			const exactExisting = existingItems.find(
				(item) => item.name.toLowerCase() === seedItem.name.toLowerCase(),
			);
			const existing = exactExisting ?? existingItems[0];

			if (existing) {
				const nextDescription = seedItem.description ?? null;
				const nextPriceGourmand = seedItem.priceGourmand ?? null;
				const nextPriceTresGourmand = seedItem.priceTresGourmand ?? null;
				const nextImageUrl = seedItem.imageUrl ?? null;

				const hasChanges =
					existing.name !== seedItem.name ||
					existing.description !== nextDescription ||
					existing.price !== seedItem.price ||
					existing.priceGourmand !== nextPriceGourmand ||
					existing.priceTresGourmand !== nextPriceTresGourmand ||
					existing.imageUrl !== nextImageUrl ||
					existing.isAvailable !== seedItem.isAvailable;

				if (!hasChanges) {
					skippedCount += 1;
					continue;
				}

				existing.name = seedItem.name;
				existing.description = nextDescription;
				existing.price = seedItem.price;
				existing.priceGourmand = nextPriceGourmand;
				existing.priceTresGourmand = nextPriceTresGourmand;
				existing.imageUrl = nextImageUrl;
				existing.isAvailable = seedItem.isAvailable;

				await menuItemsRepository.save(existing);

				const duplicatesToRemove = existingItems.filter(
					(item) => item.id !== existing.id,
				);
				if (duplicatesToRemove.length > 0) {
					await menuItemsRepository.remove(duplicatesToRemove);
					deduplicatedCount += duplicatesToRemove.length;
				}

				updatedCount += 1;
				continue;
			}

			const menuItem = menuItemsRepository.create({
				name: seedItem.name,
				description: seedItem.description,
				price: seedItem.price,
				priceGourmand: seedItem.priceGourmand ?? null,
				priceTresGourmand: seedItem.priceTresGourmand ?? null,
				imageUrl: seedItem.imageUrl,
				isAvailable: seedItem.isAvailable,
				category,
			});

			await menuItemsRepository.save(menuItem);
			insertedCount += 1;
		}

		this.logger.log(
			`Menu items seed summary: inserted=${insertedCount}, updated=${updatedCount}, skipped=${skippedCount}, deduplicated=${deduplicatedCount}`,
		);
	}
}
