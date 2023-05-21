/**

 Copyright 2023 Bufferstack.IO Analytics Technology LLP, Pune

 Licensed under the GNU General Public License, Version 3.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://www.gnu.org/licenses/gpl-3.0.html

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 **/

// Harshad Joshi, 2023
// Release data - 27 April 2023


module.exports = function(RED) {
    function AmoebaLifeCycleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const random = require('trng2');

        // Mapping for DNA to RNA and RNA to amino acids
        const DNAtoRNAMap = { 'A': 'U', 'T': 'A', 'C': 'G', 'G': 'C' };
        const RNACodonToAminoAcidMap = {
            'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
            'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
            'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'Stop', 'UAG': 'Stop',
            'UGU': 'Cys', 'UGG': 'Trp',
            'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
            'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
            'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
            'UAU': 'Tyr', 'UAC': 'Tyr',
            'CAU': 'His', 'CAC': 'His',
            'CAA': 'Gln', 'CAG': 'Gln',
            'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile',
            'AUG': 'Met',
            'AAG': 'Lys', 'AAA': 'Lys',
            'AGU': 'Ser', 'AGC': 'Ser',
            'UGA': 'Stop', 'UGG': 'Trp',
            'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
            'AGG': 'Arg', 'AGA': 'Arg',
            'UGG': 'Trp',
            'UAG': 'Stop', 'UGA': 'Stop',
        };

        // Function to generate a random DNA sequence of a given length
        function generateDNA(length) {
            let dna = '';
            const bases = ['A', 'T', 'C', 'G'];
            for(let i = 0; i < length; i++) {
                random.generate(randomNumber => {
                    dna += bases[Math.floor(randomNumber * 4)];
                });
            }
            return dna;
        }

        // Function to replicate DNA (creating a new strand that complements the original)
        function replicateDNA(dna) {
            return dna.split('').map(base => DNAtoRNAMap[base]).join('');
        }

        // Function to transcribe DNA into RNA
        function transcribeDNA(dna) {
            return dna.replace(/T/g, 'U');
        }

        // Function to translate RNA into a protein
        function translateRNA(rna) {
            let protein = '';
            for(let i = 0; i < rna.length; i += 3) {
                let codon = rna.slice(i, i + 3);
                if(RNACodonToAminoAcidMap[codon]) {
                    protein += RNACodonToAminoAcidMap[codon] + '-';
                }
            }
            return protein.slice(0, -1); // Remove trailing dash
        }

        node.on('input', function(msg) {
            // Simulate the life cycle of an amoeba
            function simulateAmoebaLifeCycle() {
                let dna = generateDNA(Math.floor(Math.random()*30) + 1);  //ToDO - make this more random..truly random like this chrome extention -  https://chrome.google.com/webstore/detail/bufferstackio-random-pass/hikeokcglhbcdalfdckidpmdcbgneelp
                let replicatedDNA = replicateDNA(dna);
                let rna = transcribeDNA(dna);
                let protein = translateRNA(rna);

                return {dna, replicatedDNA, rna, protein};
            }
            
            let result = simulateAmoebaLifeCycle();
            msg.payload = result;
            node.send(msg);
        });
    }
    RED.nodes.registerType("amoeba", AmoebaLifeCycleNode);
}

