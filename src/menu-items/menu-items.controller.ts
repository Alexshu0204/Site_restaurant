import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard as JwtAG } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@ApiTags('menu-items')
@ApiBearerAuth()
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @UseGuards(JwtAG, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Creer un plat de la carte' })
  @ApiResponse({ status: 201, description: 'Plat cree avec succes.' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les plats' })
  @ApiResponse({ status: 200, description: 'Liste des plats.' })
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un plat par son id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Plat trouve.' })
  @ApiResponse({ status: 404, description: 'Plat non trouve.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAG, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Mettre a jour un plat' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Plat mis a jour.' })
  @ApiResponse({ status: 404, description: 'Plat ou categorie non trouve(e).' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAG, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un plat' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Plat supprime.' })
  @ApiResponse({ status: 404, description: 'Plat non trouve.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.remove(id);
  }
}
