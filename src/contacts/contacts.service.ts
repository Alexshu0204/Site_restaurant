import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact, ContactStatus } from './entities/contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
  ) {}

  create(createContactDto: CreateContactDto) {
    const contact = this.contactsRepository.create({
      fullName: createContactDto.fullName,
      email: createContactDto.email,
      phone: createContactDto.phone ?? null,
      subject: createContactDto.subject,
      message: createContactDto.message,
      status: ContactStatus.New,
      adminNotes: null,
      handledAt: null,
    });

    return this.contactsRepository.save(contact);
  }

  findAllAdmin() {
    return this.contactsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneAdmin(id: number) {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Message de contact introuvable (id: ${id}).`);
    }

    return contact;
  }

  async updateAdmin(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.findOneAdmin(id);

    if (
      updateContactDto.status === undefined &&
      updateContactDto.adminNotes === undefined
    ) {
      throw new BadRequestException(
        'Aucun champ a mettre a jour. Envoyez status et/ou adminNotes.',
      );
    }

    if (updateContactDto.status !== undefined) {
      if (updateContactDto.status === contact.status) {
        throw new BadRequestException(
          `Ce message est deja au statut "${contact.status}".`,
        );
      }

      contact.status = updateContactDto.status;
      contact.handledAt =
        updateContactDto.status === ContactStatus.New ? null : new Date();
    }

    if (updateContactDto.adminNotes !== undefined) {
      contact.adminNotes = updateContactDto.adminNotes ?? null;
    }

    return this.contactsRepository.save(contact);
  }

  async removeAdmin(id: number) {
    const contact = await this.findOneAdmin(id);
    await this.contactsRepository.remove(contact);
    return { message: 'Message de contact supprime avec succes.' };
  }
}
