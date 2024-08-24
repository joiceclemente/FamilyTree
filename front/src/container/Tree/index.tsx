import React, { Component } from 'react';
import FamilyTree from '@balkangraph/familytree.js';
import { PersonData, TreeProps } from '../../utils/types';

function EditForm(this: any) {
  this.nodeId = null;
  this.obj = null;
  this.editForm = null;
  this.nameInput = null;
  this.titleInput = null;
  this.cancelButton = null;
  this.saveButton = null;
}

EditForm.prototype.init = function (obj: any) {
  this.obj = obj;
  this.editForm = document.getElementById("editForm");
  this.nameInput = document.getElementById("name") as HTMLInputElement;
  this.titleInput = document.getElementById("title") as HTMLInputElement;
  this.cancelButton = document.getElementById("cancel");
  this.saveButton = document.getElementById("save");

  if (this.cancelButton) {
    this.cancelButton.addEventListener("click", () => this.hide());
  }

  if (this.saveButton) {
    this.saveButton.addEventListener("click", () => {
      if (this.nodeId !== null) {
        const node = this.obj.get(this.nodeId);
        node.name = this.nameInput?.value;
        node.title = this.titleInput?.value;

        this.obj.updateNode(node);
        this.hide();
      }
    });
  }
};

EditForm.prototype.show = function (nodeId: number) {
  this.hide();
  this.nodeId = nodeId;

  const left = document.body.offsetWidth / 2 - 150;
  if (this.editForm) {
    this.editForm.style.display = "block";
    this.editForm.style.left = `${left}px`;
    document.getElementById('editForm_title')!.innerHTML = 'Edit';
  }

  const node = this.obj.get(nodeId);
  if (this.nameInput && this.titleInput) {
    this.nameInput.value = node.name;
    this.titleInput.value = node.title;
  }
};

EditForm.prototype.hide = function () {
  if (this.editForm) {
    this.editForm.style.display = "none";
  }
};

EditForm.prototype.on = function (action: string, handler: Function): any {
  if (typeof handler === 'function') {
    return handler();
  }
};

EditForm.prototype.content = function () {
  return "<div>Your Custom Content Here</div>";
};

EditForm.prototype.setAvatars = function () {
};

EditForm.prototype.setAvatar = function (avatar: string) {
};

export default class MyTree extends Component<TreeProps> {
  private divRef = React.createRef<HTMLDivElement>();

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.persons !== this.props.persons) {
      return true;
    }
    return false;
  }

  componentDidMount() {
  
    const formatPersonsToTreeFormat = (persons: PersonData[]) => {
      const newPersons = persons.map((e: PersonData) => {
        const {partnerId, fatherId, motherId, ...rest} = e 
        
        return {
          ...rest,
          id: e.id,
          pids: e.partnerId ? [e.partnerId] : [],
          fid: e.fatherId || undefined,
          mid: e.motherId || undefined,
          name: e.name,
          gender: e.gender.toLowerCase(),
        }
      })
      return newPersons
    }
   
    FamilyTree.templates.prodocTemplate = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.prodocTemplate.size = [150, 100];

    FamilyTree.templates.prodocTemplate_male = Object.assign({}, FamilyTree.templates.prodocTemplate);
    FamilyTree.templates.prodocTemplate_male.node = 
    `
      <rect x="0" y="0" width="150" height="100" fill="#B6D3B7" stroke-width="1" stroke="#aeaeae" rx="3" ry="3"></rect>
    `;
    FamilyTree.templates.prodocTemplate_female = Object.assign({}, FamilyTree.templates.prodocTemplate);
    
    FamilyTree.templates.prodocTemplate_female.node = 
    `
      <rect x="0" y="0" width="150" height="100" fill="#ffAE69" stroke-width="1" stroke="#aeaeae" rx="3" ry="3"></rect>
    `;

    new FamilyTree(this.divRef.current!, {
      mouseScrool: FamilyTree.action.none,
      enableSearch: false,
      template: "prodocTemplate",
      nodeMenu: {
        edit: {
          text: "Edit",
          onClick: (nodeId: number) => {
            const personToEdit = this.props.persons.find(p => p.id === nodeId);
            if (personToEdit) {
              this.props.setSelectedPerson(personToEdit);
              this.props.setIsOpen(true);
            } 
          }
        },
        remove: {
          text: "Remove",
          onClick: (nodeId: number) => {
            if (window.confirm("Are you sure you want to delete this person?")) {
              if (this.props.onDeletePerson) {
                this.props.onDeletePerson(nodeId);
              }
            }
          },
        },
      },
      editUI: new (EditForm as any)(),
        nodeBinding: {
            field_0: "name"
        },
      
      nodes: formatPersonsToTreeFormat(this.props.persons!)
  });


  window.editPerson = (personId: number) => {
    if (this.props.onEditPerson) {
      this.props.onEditPerson(personId);
    } else {
      console.error('onEditPerson não está definido');
    }
  };
}

  componentDidUpdate(prevProps: TreeProps) {

    if (prevProps.persons !== this.props.persons) {
      this.initializeFamilyTree();
    }
  }

  initializeFamilyTree = () => {
    if (this.divRef.current) {

    } else {
      console.error('divRef.current está null ou a árvore já foi inicializada');
    }
  };

  render() {
    return (
      <div 
        id="tree" 
        ref={this.divRef} 
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: '#6e6e6e',
          borderRadius: '3px',
        }}
      ></div>
    );
  }
}