/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly dataSource: DataSource) {}

	async seed(): Promise<void> {
		const categoriesRepository = this.dataSource.getRepository(Category);
		const menuItemsRepository = this.dataSource.getRepository(MenuItem);

		const categoriesMap = await this.ensureCategories(categoriesRepository);
		await this.ensureMenuItems(menuItemsRepository, categoriesMap);

		this.logger.log('Seed termine avec succes.');
	}

	// This method ensures that the predefined categories exist in the database.
	private async ensureCategories(
		categoriesRepository: Repository<Category>,
	): Promise<Map<string, Category>> {
		// Define the category names we want to ensure exist in the database.
		const categoryNames = ['COMPTOIRE DE LA MER', 'VIANDES', 'ENTRÉES', 'SALADES', 'BURGERS', 'PÂTES & RISOTTO', 'NOTRE CRÉATION VÉGÉTARIENNE', 'POISSONS', 'FROMAGES', 'LES CROQUES', 'LES PLANCHES', 'FINGER FOOD', 'DESSERTS', 'GLACES & SORBETS', 'CHAMPAGNES'];
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
			price: number;
			priceGourmand: number | null;
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

			
			
		];

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
				const nextImageUrl = seedItem.imageUrl ?? null;

				const hasChanges =
					existing.name !== seedItem.name ||
					existing.description !== nextDescription ||
					existing.price !== seedItem.price ||
					existing.priceGourmand !== nextPriceGourmand ||
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
