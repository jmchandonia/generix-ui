import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ObjectGraphMapService } from '../../shared/services/object-graph-map.service';
import { ObjectMetadata } from '../../shared/models/object-metadata';
import { Select2OptionData } from 'ng2-select2';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-plot-options',
  templateUrl: './plot-options.component.html',
  styleUrls: ['./plot-options.component.css'],
})
export class PlotOptionsComponent implements OnInit {

  private dimensions = ['x', 'y', 'z'];
  private plotObject: ObjectMetadata;
  private plotTypeData: Array<Select2OptionData> = [{id: '', text: ''}];
  private formDimensions: FormArray;
  private testForm: any;
  private listPlotTypes: any;
  private plotForm = this.fb.group({
    plotType: '',
    graphTitle: [''],
    dimensions: this.fb.array([])
  });

  public plotIcons = {
    'Heat Map': '<i class="material-icons dropdown-icon">gradient</i>',
    'Horizontal Barchart': '<i class="material-icons dropdown-icon rotated">insert_chart</i>',
    'Vertical Barchart': '<i class="material-icons dropdown-icon">insert_chart</i>',
    'Stacked Barchart': '<i class="material-icons dropdown-icon">clear_all</i>',
    'Line Plot': '<i class="material-icons dropdown-icon">timeline</i>',
    'Scatter Plot': '<i class="material-icons dropdown-icon">scatter_plot</i>'
  };

  private plotTypeOptions: Select2Options = {
    width: '100%',
    templateResult: state => {
      if (!state.id) {
        return state;
      }
      return `${this.plotIcons[state.text]} <span>${state.text}</span>`;
    },
    escapeMarkup: m => m
  };

  constructor(
    private route: ActivatedRoute,
    private objectGraphMap: ObjectGraphMapService,
    private fb: FormBuilder,
    ) { }
  private objectId: string;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.objectId = params.id;
    });
    this.plotObject = this.objectGraphMap.getSelectedObject();
    this.listPlotTypes = this.objectGraphMap.listPlotTypes();
    const plotTypes = this.listPlotTypes.map(item => item.type);
    plotTypes.forEach((val, idx) => {
      this.plotTypeData.push({ id: idx.toString(), text: val });
    });
  }

  addDimensions(index) {
    this.formDimensions = this.plotForm.get('dimensions') as FormArray;

    // clear old values from previous plot types
    while (this.formDimensions.value.length) {
      this.formDimensions.removeAt(0);
    }
    // add N new dimensions from selected plot type
    const selected = this.listPlotTypes[index];
    for (let i = 0; i < selected.dimensions; i++) {
      this.formDimensions.push(this.createDimensionItem());
    }
    console.log('UGH', this.formDimensions);
  }

  createDimensionItem() {
    return this.fb.group({
      fromDimension: '',
      displayValuesFrom: this.fb.array([]),
      displayAxisLabels: false,
      displayAxisLabelsAs: this.fb.array([]),
      displayHoverLabels: false,
      displayHoverLabelsAs: '',
      displayAxisTitle: false,
      axisTitle: ''
    });
  }

  updatePlotType(event) {
    this.plotForm.controls.plotType.setValue(event.data[0].text);
    this.addDimensions(event.value);
  }

  submit() {
    // this.objectGraphMap.submitNewPlot(this.plotForm);
    console.log('plot form', this.plotForm);
  }

}
