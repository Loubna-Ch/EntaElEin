import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Participant } from '../../participant/entities/participant.entity';
import { CrimeReport } from '../../report/entities/crime-report.entity';

@Entity('involvedin')
export class InvolvedIn {
  @PrimaryColumn()
  participantid!: number;

  @PrimaryColumn()
  reportid!: number;

  @ManyToOne(() => Participant, (participant) => participant.reports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'participantid' })
  participant!: Participant;

  @ManyToOne(() => CrimeReport, (report) => report.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reportid' })
  report!: CrimeReport;
}
