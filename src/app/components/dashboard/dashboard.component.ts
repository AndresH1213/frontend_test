import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WordsService } from 'src/app/services/words.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  wordPairs: any[] = [];

  public username: string = 'safda';

  public displayModal: boolean = false;
  public modalError: boolean = false;

  public editingPairId: string = '';
  public editingWord1: string = '';
  public editingWord2: string = '';

  public word1: string = '';
  public word2: string = '';

  public msgAdded: boolean = false;

  constructor(
    private wordsS: WordsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllWords();
    console.log(this.authService.getUser);
    this.username = this.authService.getUser;
  }

  getAllWords() {
    this.wordsS.getAllwords().subscribe((value: any) => {
      this.wordPairs = [...value.words];
      console.log(this.wordPairs);
    });
  }

  addWords() {
    if (this.word1 === '' || this.word2 === '') {
      Swal.fire('Word Missing', 'Please provide two words', 'error');
      return;
    }
    const body = {
      word1: this.word1,
      word2: this.word2,
    };
    this.wordsS.createWord(body).subscribe((value) => {
      if (value.hasOwnProperty('msg')) {
        this.msgAdded = true;
        setTimeout(() => {
          this.msgAdded = false;
        }, 2000);
      }
      this.word1 = '';
      this.word2 = '';
      this.getAllWords();
    });
  }

  editMode(id: string) {
    this.displayModal = true;
    this.wordsS.getOneWord(id).subscribe((value: any) => {
      const pairs = value.pair[0];
      this.editingWord1 = pairs.word1;
      this.editingWord2 = pairs.word2;
      this.editingPairId = id;
    });
  }

  updatePair() {
    if (!this.displayModal && this.editingPairId === '') {
      return;
    }

    const body = {
      word1: this.editingWord1,
      word2: this.editingWord2,
    };

    if (body.word1 === '' || body.word2 === '') {
      this.displayModal = false;
      Swal.fire('Word Missing', 'Please provide two words', 'error');
      return;
    }

    this.wordsS.updateWord(this.editingPairId, body).subscribe((value) => {
      this.getAllWords();
      this.displayModal = false;
    });
  }

  deletePair(id: string) {
    Swal.fire({
      title: `Do you want to delete it?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.wordsS.deleteWord(id).subscribe((resp) => {
            Swal.fire('Deleted!', 'Your file has been deleted', 'success');
            this.getAllWords();
          });
        }
      })
      .catch(console.log);
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/register');
  }
}
