// This is a simple service to log the loaded TypeORM entities on application startup,
// which can help with debugging entity loading issues. It will only log in
// non-production environments to avoid cluttering logs in production.

// I personally make it a point to ensure that all entities are correctly loaded
// (by the autoLoadEntities: true) and to quickly identify any issues with entity
// registration.

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeormDebugService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TypeormDebugService.name);

  constructor(private readonly dataSource: DataSource) {}

  onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const entities = this.dataSource.entityMetadatas.map(
      (meta) => `${meta.name} (${meta.tableName})`,
    );

    this.logger.log(
      `TypeORM loaded entities (${entities.length}): ${entities.join(', ')}`,
    );
  }
}
