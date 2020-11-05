import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Axis, AxisOption } from 'src/app/shared/models/plotly-builder';
import { AxisData } from 'src/app/shared/models/plotly-config';
import { DimensionContext } from 'src/app/shared/models/object-metadata';

@Component({
  selector: 'app-axis-option',
  templateUrl: './axis-option.component.html',
  styleUrls: ['./axis-option.component.css']
})

export class AxisOptionComponent implements OnInit, OnChanges {

  @Input() axis: Axis;
  @Input() axisValidation: AxisData;
  @Input() public dimContext: DimensionContext;
  @Input() invalid = false;
  
  public validOptions: AxisOption[];
  private _options: AxisOption[];
  @Input() set options(_options: AxisOption[]) {
    this._options = _options;
    this.validOptions = this.axisValidation.numeric_only
      ? this.options.filter(option => {
        return option.scalarType === 'float' ||
        option.scalarType === 'int' ||
        option.scalarType === 'date';
      })
      : this.options;
  }
  get options() { return this._options }

  @Input() coreType = false;
  @Input() label: string;

  @Output() selected: EventEmitter<AxisOption> = new EventEmitter();
  @Output() selectionCleared: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    if (this.validOptions.length === 1) {
      this.axis.data = this.validOptions[0];
      if (this.axis.data.dimension !== undefined) {
        this.axis.dimIdx = this.axis.data.dimension;
        this.selected.emit(this.axis.data);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  setAxis(event: AxisOption) {
    if (event === undefined) return; // dont handle cancelled items here
    this.axis.title = event.displayName;
    if (event.dimension !== undefined) {
      this.axis.dimIdx = event.dimension;
    }
    this.selected.emit(this.axis.data);
  }

  handleClear(event) {
    delete this.axis.data;
    delete this.axis.dimIdx;
    delete this.axis.dimVarIdx;
    delete this.axis.dataVarIdx;
    this.axis.title = '';
    this.selectionCleared.emit();
  }

}