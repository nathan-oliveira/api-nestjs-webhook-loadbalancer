import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Get,
  Put,
  Post,
  Patch,
  Delete,
  Res,
  Query,
} from '@nestjs/common';

import {
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';

import { Rule } from 'src/modules/auth/enums/rule.enum';
import { JwtAuth } from 'src/modules/auth/decorators/jwt-auth.decorator';
import { ParamId } from 'src/modules/auth/decorators/param-id.decorator';

import {
  ReadCompanyDto,
  QueryCompanyDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from './dtos';

import { CompaniesService } from './companies.service';
import { WebHooksInterceptor } from '../webhooks/webhooks.interceptor';

@ApiTags('Company')
@Controller('companies')
@UseInterceptors(ClassSerializerInterceptor)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @JwtAuth(Rule.ADMIN)
  @UseInterceptors(WebHooksInterceptor)
  @ApiOkResponse({ type: ReadCompanyDto })
  @ApiBody({ type: CreateCompanyDto })
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<ReadCompanyDto> {
    const company = await this.companiesService.create(createCompanyDto);
    return plainToClass(ReadCompanyDto, company);
  }

  @Get()
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: [ReadCompanyDto] })
  @ApiQuery({ type: QueryCompanyDto })
  async findAllCompany(
    @Res({ passthrough: true }) res: Response,
    @Query() queryCompanyDto: QueryCompanyDto,
  ): Promise<ReadCompanyDto[]> {
    const { items, meta } =
      await this.companiesService.findByPaginate(queryCompanyDto);

    res.setHeader('X-Total-Items', meta.totalItems);
    return plainToClass(ReadCompanyDto, items);
  }

  @Get(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadCompanyDto })
  @ApiParam({ name: 'id', type: Number })
  async findOneCompany(@ParamId() id: number): Promise<ReadCompanyDto> {
    const company = await this.companiesService.findById(id);
    return plainToClass(ReadCompanyDto, company);
  }

  @Put(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadCompanyDto })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiParam({ name: 'id', type: Number })
  async updateCompany(
    @ParamId() id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ReadCompanyDto> {
    const company = await this.companiesService.update(id, updateCompanyDto);
    return plainToClass(ReadCompanyDto, company);
  }

  @Patch(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadCompanyDto })
  @ApiParam({ name: 'id', type: Number })
  async disableOrActivateCompany(
    @ParamId() id: number,
  ): Promise<ReadCompanyDto> {
    const book = await this.companiesService.disableOrActivate(id);
    return plainToClass(ReadCompanyDto, book);
  }

  @Delete(':id')
  @JwtAuth(Rule.ADMIN)
  @UseInterceptors(WebHooksInterceptor)
  @ApiOkResponse({ type: ReadCompanyDto })
  @ApiParam({ name: 'id', type: Number })
  async removeCompany(@ParamId() id: number): Promise<ReadCompanyDto> {
    const companyRemoved = await this.companiesService.remove(id);
    return plainToClass(ReadCompanyDto, companyRemoved);
  }
}
